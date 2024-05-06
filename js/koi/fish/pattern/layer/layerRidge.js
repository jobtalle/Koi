/**
 * A pattern along the back of a fish
 * @param {Plane} plane A plane sampler
 * @param {Number} paletteIndex A palette sample index
 * @param {Number} scale The noise scale in the range [0, 255]
 * @param {Number} power The ridge power in the range [0, 255]
 * @param {Number} threshold The noise threshold in the range [0, 255]
 * @param {Number} focus The pattern focus along the spine of the fish in the range [0, 255]
 * @param {Number} focusPower The power of the pattern near the focal point in the range [0, 255]
 * @constructor
 */
const LayerRidge = function(
    plane,
    paletteIndex,
    scale,
    power,
    threshold,
    focus,
    focusPower) {
    this.plane = plane;
    this.paletteIndex = paletteIndex;
    this.scale = scale;
    this.power = power;
    this.threshold = threshold;
    this.focus = focus;
    this.focusPower = focusPower;

    Layer.call(this, this.ID, paletteIndex, true, false, true, this.DOMINANCE);
};

LayerRidge.prototype = Object.create(Layer.prototype);

LayerRidge.prototype.DOMINANCE = .65;
LayerRidge.prototype.SAMPLER_SCALE = new SamplerPlateau(1.8, 4, 5.5, .7);
LayerRidge.prototype.SAMPLER_POWER = new SamplerPlateau(0.73, 2.15, 3.5, .5);
LayerRidge.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(.3, .5, .7, .4);
LayerRidge.prototype.SAMPLER_FOCUS = new SamplerPlateau(0, 0.5, 1, .6);
LayerRidge.prototype.SAMPLER_FOCUS_POWER = new SamplerPower(.4, .6, 1);

LayerRidge.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying highp vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerRidge.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise3 + `
uniform lowp vec3 color;
uniform highp float scale;
uniform highp float power;
uniform highp float threshold;
uniform highp float focus;
uniform highp float focusPower;
uniform highp vec2 size;
uniform highp vec3 origin;
uniform highp mat3 rotate;

varying highp vec2 iUv;

#define RIDGE_ATTENUATION 1.4
#define ATTENUATION 2.0

void main() {
  highp float phaseThreshold = pow(1.0 - RIDGE_ATTENUATION * abs(iUv.y - 0.5), power);
  highp vec2 at = (iUv - vec2(0.5)) * size * scale;
  highp float noise = cubicNoise(origin + vec3(at, 0.0) * rotate);
  highp float strength = pow(max(0.0, 1.0 - ATTENUATION * abs(iUv.x - focus)), focusPower);
  
  if (noise > phaseThreshold * strength)
    discard;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Deserialize a ridge pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {LayerRidge} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerRidge.deserialize = function(buffer) {
    return new LayerRidge(
        Plane.deserialize(buffer),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8(),
        buffer.readUint8());
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerRidge.prototype.serialize = function(buffer) {
    this.plane.serialize(buffer);

    buffer.writeUint8(this.paletteIndex);
    buffer.writeUint8(this.scale);
    buffer.writeUint8(this.power);
    buffer.writeUint8(this.threshold);
    buffer.writeUint8(this.focus);
    buffer.writeUint8(this.focusPower);
};

/**
 * Make a deep copy of this layer
 * @returns {LayerRidge} A copy of this layer
 */
LayerRidge.prototype.copy = function() {
    return new LayerRidge(
        this.plane.copy(),
        this.paletteIndex,
        this.scale,
        this.power,
        this.threshold,
        this.focus,
        this.focusPower);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerRidge.prototype.configure = function(gl, program, color) {
    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
    gl.uniform1f(program["uPower"], this.SAMPLER_POWER.sample(this.power / 0xFF));
    gl.uniform1f(program["uScale"], this.SAMPLER_SCALE.sample(this.scale / 0xFF));
    gl.uniform1f(program["uThreshold"], this.SAMPLER_THRESHOLD.sample(this.threshold / 0xFF));
    gl.uniform1f(program["uFocus"], this.SAMPLER_FOCUS.sample(this.focus / 0xFF));
    gl.uniform1f(program["uFocusPower"], this.SAMPLER_FOCUS_POWER.sample(this.focusPower / 0xFF));
    gl.uniform3f(program["uOrigin"], this.plane.anchor.x, this.plane.anchor.y, this.plane.anchor.z);
    gl.uniformMatrix3fv(program["uRotate"], false, this.plane.makeMatrix());
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerRidge.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        [
            "scale",
            "power",
            "threshold",
            "focus",
            "focusPower",
            "size",
            "origin",
            "rotate",
            "color"
        ]);
};