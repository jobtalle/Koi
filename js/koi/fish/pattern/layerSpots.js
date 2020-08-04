/**
 * A coloured spots pattern
 * @param {Number} scale The noise scale in the range [0, 255]
 * @param {Palette.Sample} sample A palette sample
 * @param {Vector3} anchor The noise sample position
 * @param {Vector3} x The noise sample X direction
 * @constructor
 */
const LayerSpots = function(scale, sample, anchor, x) {
    this.scale = scale;
    this.anchor = anchor;
    this.x = x;

    Layer.call(this, this.ID, sample, true, false, false, this.DOMINANCE);
};

LayerSpots.prototype = Object.create(Layer.prototype);

LayerSpots.prototype.DOMINANCE = .25;
LayerSpots.prototype.UP = new Vector3(0, 1, 0);
LayerSpots.prototype.UP_ALT = new Vector3(.1, 1, 0);
LayerSpots.prototype.SAMPLER_SCALE = new SamplerPlateau(.5, 1.8, 6, 5);
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
uniform mediump vec2 size;
uniform highp vec3 anchor;
uniform highp mat3 rotate;

varying mediump vec2 iUv;
varying lowp vec3 iColor;

void main() {
  highp vec2 at = (iUv - vec2(0.5)) * size * scale;
  mediump float noise = cubicNoise(anchor + vec3(at, 0.0) * rotate);

  if (noise < 0.5)
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
    const scale = buffer.readByte();
    const sample = Palette.Sample.deserialize(buffer);
    const anchor = new Vector3().deserialize(buffer);

    if (!anchor.withinLimits(LayerSpots.prototype.SPACE_LIMIT_MIN, LayerSpots.prototype.SPACE_LIMIT_MAX))
        throw new RangeError();

    const x = new Vector3().deserialize(buffer);

    if (!x.isNormal())
        throw new RangeError();

    return new LayerSpots(scale, sample, anchor, x);
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
LayerSpots.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.scale);

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
        this.paletteSample.copy(),
        this.anchor.copy(),
        this.x.copy());
};

/**
 * Get the z direction vector, which depends on the X direction vector
 * @returns {Vector3} The Z direction vector
 */
LayerSpots.prototype.getZ = function() {
    if (this.x.equals(this.UP))
        return this.x.cross(this.UP_ALT).normalize();

    return this.x.cross(this.UP).normalize();
};

/**
 * Get the Y direction vector, which depends on the Z direction vector
 * @param {Vector3} z The Z direction vector
 * @returns {Vector3} The Y direction vector
 */
LayerSpots.prototype.getY = function(z) {
    return this.x.cross(z);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerSpots.prototype.configure = function(gl, program, color) {
    const z = this.getZ();
    const y = this.getY(z);

    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
    gl.uniform1f(program["uScale"], this.SAMPLER_SCALE.sample(this.scale / 0xFF));
    gl.uniform3f(program["uAnchor"], this.anchor.x, this.anchor.y, this.anchor.z);
    gl.uniformMatrix3fv(
        program["uRotate"],
        false,
        [
            this.x.x, this.x.y, this.x.z,
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
        ["scale", "size", "anchor", "rotate", "color"],
        ["position", "uv"]);
};