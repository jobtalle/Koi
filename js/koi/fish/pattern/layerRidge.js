/**
 * A pattern along the back of a fish
 * @param {Plane} plane A plane sampler
 * @param {Palette.Sample} sample A palette sample
 * @param {Number} scale The noise scale in the range [0, 255]
 * @param {Number} power The ridge power in the range [0, 255]
 * @param {Number} threshold The noise threshold in the range [0, 255]
 * @constructor
 */
const LayerRidge = function(plane, sample, scale, power, threshold) {
    this.plane = plane;
    this.scale = scale;
    this.power = power;
    this.threshold = threshold;

    Layer.call(this, this.ID, sample, true, false, false, this.DOMINANCE);
};

LayerRidge.prototype = Object.create(Layer.prototype);

LayerRidge.prototype.DOMINANCE = .65;
LayerRidge.prototype.SAMPLER_SCALE = new SamplerPlateau(1.8, 4, 5.5, 3);
LayerRidge.prototype.SAMPLER_POWER = new SamplerPlateau(0.73, 1.15, 3.5, 5);
LayerRidge.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(.3, .5, .7, 1);

LayerRidge.prototype.SHADER_VERTEX = `#version 100
uniform lowp vec3 color;

attribute vec2 position;
attribute vec2 uv;

varying mediump vec2 iUv;
varying lowp vec3 iColor;

void main() {
  iUv = uv;
  iColor = color;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerRidge.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise3 + `
uniform mediump float scale;
uniform mediump float power;
uniform mediump float threshold;
uniform mediump vec2 size;
uniform highp vec3 origin;
uniform highp mat3 rotate;

varying mediump vec2 iUv;
varying lowp vec3 iColor;

void main() {
  mediump float phaseThreshold = pow(1.0 - 2.0 * abs(iUv.y - 0.5), power);
  highp vec2 at = (iUv - vec2(0.5)) * size * scale;
  mediump float noise = cubicNoise(origin + vec3(at, 0.0) * rotate);
  
  if (noise > phaseThreshold)
    discard;
  
  gl_FragColor = vec4(iColor, 1.0);
}
`;

/**
 * Deserialize a ridge pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @returns {LayerRidge} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerRidge.deserialize = function(buffer) {
    const plane = Plane.deserialize(buffer);
    const sample = Palette.Sample.deserialize(buffer);
    const scale = buffer.readUint8();
    const power = buffer.readUint8();
    const threshold = buffer.readUint8();

    return new LayerRidge(plane, sample, scale, power, threshold);
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerRidge.prototype.serialize = function(buffer) {
    this.plane.serialize(buffer);
    this.paletteSample.serialize(buffer);

    buffer.writeUint8(this.scale);
    buffer.writeUint8(this.power);
    buffer.writeUint8(this.threshold);
};

/**
 * Make a deep copy of this layer
 * @returns {LayerRidge} A copy of this layer
 */
LayerRidge.prototype.copy = function() {
    return new LayerRidge(
        this.plane.copy(),
        this.paletteSample.copy(),
        this.scale,
        this.power,
        this.threshold);
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
        ["scale", "power", "threshold", "size", "origin", "rotate", "color"]);
};