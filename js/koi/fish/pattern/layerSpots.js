/**
 * A coloured spots pattern
 * @param {Number} scale The noise scale in the range [0, 255]
 * @param {Number} threshold The noise threshold in the range [0, 255]
 * @param {Number} stretch The stretch factor in the range [0, 255]
 * @param {Palette.Sample} sample A palette sample
 * @param {Vector3} anchor The noise sample position
 * @param {Vector3} x The noise sample X direction
 * @constructor
 */
const LayerSpots = function(scale, threshold, stretch, sample, anchor, x) {
    this.scale = scale;
    this.threshold = threshold;
    this.stretch = stretch;
    this.anchor = anchor;
    this.x = x;

    Layer.call(this, this.ID, sample, true, false, false, this.DOMINANCE);
};

LayerSpots.prototype = Object.create(Layer.prototype);

LayerSpots.prototype.DOMINANCE = .25;
LayerSpots.prototype.SAMPLER_SCALE = new SamplerPlateau(.5, 1.8, 6, 11);
LayerSpots.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(.25, .5, .75, 2);
LayerSpots.prototype.SAMPLER_STRETCH = new SamplerPlateau(.5, 1, 2, 2);
LayerSpots.prototype.SPACE_LIMIT_MIN = Math.fround(-256);
LayerSpots.prototype.SPACE_LIMIT_MAX = Math.fround(256);

LayerSpots.prototype.SHADER_VERTEX = `#version 100
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

LayerSpots.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise + `
uniform mediump float scale;
uniform mediump float threshold;
uniform mediump vec2 size;
uniform highp vec3 anchor;
uniform highp mat3 rotate;

varying mediump vec2 iUv;
varying lowp vec3 iColor;

void main() {
  highp vec2 at = (iUv - vec2(0.5)) * size * scale;
  mediump float noise = cubicNoise(anchor + vec3(at, 0.0) * rotate);

  if (noise < threshold)
    discard;
    
  gl_FragColor = vec4(iColor, 1.0);
}
`;

/**
 * Deserialize a spots pattern
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @returns {LayerSpots} The deserialized pattern
 * @throws {RangeError} A range error if deserialized values are not valid
 */
LayerSpots.deserialize = function(buffer) {
    const scale = buffer.readUint8();
    const threshold = buffer.readUint8();
    const stretch = buffer.readUint8();
    const sample = Palette.Sample.deserialize(buffer);
    const anchor = new Vector3().deserialize(buffer);

    if (!anchor.withinLimits(LayerSpots.prototype.SPACE_LIMIT_MIN, LayerSpots.prototype.SPACE_LIMIT_MAX))
        throw new RangeError();

    const x = new Vector3().deserialize(buffer);

    if (!x.isNormal())
        throw new RangeError();

    return new LayerSpots(scale, threshold, stretch, sample, anchor, x);
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerSpots.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.scale);
    buffer.writeUint8(this.threshold);
    buffer.writeUint8(this.stretch);

    this.paletteSample.serialize(buffer);
    this.anchor.serialize(buffer);
    this.x.serialize(buffer);
};

/**
 * Make a deep copy of this layer
 * @returns {LayerSpots} A copy of this layer
 */
LayerSpots.prototype.copy = function() {
    return new LayerSpots(
        this.scale,
        this.threshold,
        this.stretch,
        this.paletteSample.copy(),
        this.anchor.copy(),
        this.x.copy());
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerSpots.prototype.configure = function(gl, program, color) {
    const z = this.x.makeOrthogonal();
    const y = this.x.cross(z);
    const stretch = this.SAMPLER_STRETCH.sample(this.stretch / 0xFF);

    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
    gl.uniform1f(program["uScale"], this.SAMPLER_SCALE.sample(this.scale / 0xFF));
    gl.uniform1f(program["uThreshold"], this.SAMPLER_THRESHOLD.sample(this.threshold / 0xFF));
    gl.uniform3f(program["uAnchor"], this.anchor.x, this.anchor.y, this.anchor.z);
    gl.uniformMatrix3fv(
        program["uRotate"],
        false,
        [
            this.x.x * stretch, this.x.y * stretch, this.x.z * stretch,
            y.x, y.y, y.z,
            z.x, z.y, z.z
        ]);
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
        ["scale", "threshold", "size", "anchor", "rotate", "color"],
        ["position", "uv"]);
};