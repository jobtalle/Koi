/**
 * A coloured spots pattern
 * @param {Plane} plane A sampling plane
 * @param {Palette.Sample} sample A palette sample
 * @param {Number} scale The noise scale in the range [0, 255]
 * @param {Number} stretch The X axis stretch in the range [0, 255]
 * @param {Number} threshold The noise threshold in the range [0, 255]
 * @param {Number} xFocus The focus of the pattern along the X axis in the range [0, 255]
 * @param {Number} yFocus The focus of the pattern along the Y axis in the range [0, 255]
 * @param {Number} power The power of the pattern near the focal point in the range [0, 255]
 * @constructor
 */
const LayerSpots = function(
    plane,
    sample,
    scale,
    stretch,
    threshold,
    xFocus,
    yFocus,
    power) {
    this.plane = plane;
    this.scale = scale;
    this.stretch = stretch;
    this.threshold = threshold;
    this.xFocus = xFocus;
    this.yFocus = yFocus;
    this.power = power;

    Layer.call(this, this.ID, sample, true, false, false, this.DOMINANCE);
};

LayerSpots.prototype = Object.create(Layer.prototype);

LayerSpots.prototype.DOMINANCE = .25;
LayerSpots.prototype.SAMPLER_SCALE = new SamplerPlateau(.5, 1.8, 6, 11);
LayerSpots.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(.25, .5, .75, 2);
LayerSpots.prototype.SAMPLER_STRETCH = new SamplerPlateau(.37, 1, 2.5, 1);
LayerSpots.prototype.SAMPLER_X_FOCUS = new SamplerPlateau(0, 0.4, 1, 1);
LayerSpots.prototype.SAMPLER_Y_FOCUS = new SamplerPlateau(0, 0.5, 1, 12);
LayerSpots.prototype.SAMPLER_POWER = new SamplerPower(0, 1, 10);

LayerSpots.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;

  gl_Position = vec4(position, 0.0, 1.0);
}
`;

LayerSpots.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise3 + `
uniform lowp vec3 color;
uniform mediump float scale;
uniform mediump float stretch;
uniform mediump float threshold;
uniform mediump vec2 focus;
uniform mediump float power;
uniform mediump vec2 size;
uniform highp vec3 anchor;
uniform highp mat3 rotate;

varying mediump vec2 iUv;

void main() {
  highp vec2 at = vec2(iUv.x * stretch - 0.5, iUv.y - 0.5) * size * scale;
  mediump float noise = cubicNoise(anchor + vec3(at, 0.0) * rotate);
  mediump float strength = pow(max(0.0, 1.0 - 2.0 * length(iUv - focus)), power);

  if (noise > threshold * strength)
    discard;
    
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Deserialize a spots pattern
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @returns {LayerSpots} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerSpots.deserialize = function(buffer) {
    return new LayerSpots(
        Plane.deserialize(buffer),
        Palette.Sample.deserialize(buffer),
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
LayerSpots.prototype.serialize = function(buffer) {
    this.plane.serialize(buffer);
    this.paletteSample.serialize(buffer);

    buffer.writeUint8(this.scale);
    buffer.writeUint8(this.stretch);
    buffer.writeUint8(this.threshold);
    buffer.writeUint8(this.xFocus);
    buffer.writeUint8(this.yFocus);
    buffer.writeUint8(this.power);
};

/**
 * Make a deep copy of this layer
 * @returns {LayerSpots} A copy of this layer
 */
LayerSpots.prototype.copy = function() {
    return new LayerSpots(
        this.plane.copy(),
        this.paletteSample.copy(),
        this.scale,
        this.stretch,
        this.threshold,
        this.xFocus,
        this.yFocus,
        this.power);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerSpots.prototype.configure = function(gl, program, color) {
    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
    gl.uniform1f(program["uScale"], this.SAMPLER_SCALE.sample(this.scale / 0xFF));
    gl.uniform1f(program["uStretch"], this.SAMPLER_STRETCH.sample(this.stretch / 0xFF));
    gl.uniform1f(program["uThreshold"], this.SAMPLER_THRESHOLD.sample(this.threshold / 0xFF));
    gl.uniform2f(program["uFocus"],
        this.SAMPLER_X_FOCUS.sample(this.xFocus / 0xFF),
        this.SAMPLER_Y_FOCUS.sample(this.yFocus / 0xFF));
    gl.uniform1f(program["uPower"], this.SAMPLER_POWER.sample(this.power / 0xFF));
    gl.uniform3f(program["uAnchor"], this.plane.anchor.x, this.plane.anchor.y, this.plane.anchor.z);
    gl.uniformMatrix3fv(program["uRotate"], false, this.plane.makeMatrix());
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerSpots.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "uv"],
        [
            "scale",
            "stretch",
            "threshold",
            "size",
            "anchor",
            "rotate",
            "color",
            "focus",
            "power"]);
};