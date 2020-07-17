/**
 * A coloured spots pattern
 * @param {Number} scale The noise scale
 * @param {Color} color The spot color
 * @param {Vector3} anchor The noise sample position
 * @param {Vector3} x The noise sample X direction
 * @constructor
 */
const PatternSpots = function(scale, color, anchor, x) {
    this.scale = scale;
    this.color = color; // TODO: Use gradient location
    this.anchor = anchor;
    this.x = x;
};

PatternSpots.prototype.UP = new Vector3(0, 1, 0);
PatternSpots.prototype.UP_ALT = new Vector3(.1, 1, 0);
PatternSpots.prototype.SCALE_MIN = Math.fround(0.5);
PatternSpots.prototype.SCALE_MAX = Math.fround(5);
PatternSpots.prototype.SPACE_LIMIT_MIN = Math.fround(-256);
PatternSpots.prototype.SPACE_LIMIT_MAX = Math.fround(256);

PatternSpots.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying mediump vec2 iUv;

void main() {
  iUv = uv;

  gl_Position = vec4(position, 0.0, 1.0);
}
`;

PatternSpots.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise + `
uniform mediump float scale;
uniform mediump vec2 size;
uniform lowp vec3 color;
uniform highp vec3 anchor;
uniform highp mat3 rotate;

varying mediump vec2 iUv;

void main() {
  highp vec2 at = (iUv - vec2(0.5)) * size * scale;
  mediump float noise = cubicNoise(anchor + vec3(at, 0.0) * rotate);

  if (noise < 0.5)
    discard;
    
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Deserialize a spots pattern
 * @param {BinBuffer} buffer The buffer to deserialize from
 */
PatternSpots.deserialize = function(buffer) {
    const scale = buffer.readFloat();

    if (!(scale >= PatternSpots.prototype.SCALE_MIN && scale <= PatternSpots.prototype.SCALE_MAX))
        throw -1;

    const color = Color.deserialize(buffer);
    const anchor = new Vector3().deserialize(buffer);

    if (!anchor.withinLimits(PatternSpots.prototype.SPACE_LIMIT_MIN, PatternSpots.prototype.SPACE_LIMIT_MAX))
        throw -1;

    const x = new Vector3().deserialize(buffer);

    if (!x.isNormal())
        throw -1;

    return new PatternSpots(scale, color, anchor, x);
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer The buffer to serialize to
 */
PatternSpots.prototype.serialize = function(buffer) {
    buffer.writeFloat(this.scale);
    this.color.serialize(buffer);
    this.anchor.serialize(buffer);
    this.x.serialize(buffer);
};

/**
 * Get the z direction vector, which depends on the X direction vector
 * @returns {Vector3} The Z direction vector
 */
PatternSpots.prototype.getZ = function() {
    if (this.x.equals(this.UP))
        return this.x.cross(this.UP_ALT).normalize();

    return this.x.cross(this.UP).normalize();
};

/**
 * Get the Y direction vector, which depends on the Z direction vector
 * @param {Vector3} z The Z direction vector
 * @returns {Vector3} The Y direction vector
 */
PatternSpots.prototype.getY = function(z) {
    return this.x.cross(z);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
PatternSpots.prototype.configure = function(gl, program) {
    const z = this.getZ();
    const y = this.getY(z);

    gl.uniform1f(program["uScale"], this.scale);
    gl.uniform3f(program["uColor"], this.color.r, this.color.g, this.color.b);
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
PatternSpots.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["scale", "size", "color", "anchor", "rotate"],
        ["position", "uv"]);
};