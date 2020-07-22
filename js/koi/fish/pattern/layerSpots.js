/**
 * A coloured spots pattern
 * @param {Number} scale The noise scale
 * @param {Palette.Sample} sample A palette sample
 * @param {Vector3} anchor The noise sample position
 * @param {Vector3} x The noise sample X direction
 * @constructor
 */
const LayerSpots = function(scale, sample, anchor, x) {
    this.scale = scale;
    this.sample = sample;
    this.anchor = anchor;
    this.x = x;

    Layer.call(this, this.ID, true, false);
};

LayerSpots.prototype = Object.create(Layer.prototype);

LayerSpots.prototype.UP = new Vector3(0, 1, 0);
LayerSpots.prototype.UP_ALT = new Vector3(.1, 1, 0);
LayerSpots.prototype.SCALE_MIN = Math.fround(0.5);
LayerSpots.prototype.SCALE_MAX = Math.fround(5);
LayerSpots.prototype.SPACE_LIMIT_MIN = Math.fround(-256);
LayerSpots.prototype.SPACE_LIMIT_MAX = Math.fround(256);

LayerSpots.prototype.SHADER_VERTEX = `#version 100
uniform sampler2D palette;
uniform mediump vec2 sample;

attribute vec2 position;
attribute vec2 uv;

varying mediump vec2 iUv;
varying lowp vec3 iColor;

void main() {
  iUv = uv;
  iColor = texture2D(palette, sample).rgb;

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
    const scale = buffer.readFloat();

    if (!(scale >= LayerSpots.prototype.SCALE_MIN && scale <= LayerSpots.prototype.SCALE_MAX))
        throw new RangeError();

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
    buffer.writeFloat(this.scale);

    this.sample.serialize(buffer);
    this.anchor.serialize(buffer);
    this.x.serialize(buffer);
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
 * @param {Number} texture The index of the color palette for this layer
 */
LayerSpots.prototype.configure = function(gl, program, texture) {
    const z = this.getZ();
    const y = this.getY(z);

    gl.uniform1i(program["uPalette"], texture);
    gl.uniform2f(program["uSample"], (this.sample.x + .5) / 256, (this.sample.y + .5) / 256);
    gl.uniform1f(program["uScale"], this.scale);
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
        ["scale", "size", "anchor", "rotate", "palette", "sample"],
        ["position", "uv"]);
};