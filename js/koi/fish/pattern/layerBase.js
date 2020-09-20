/**
 * A base color for a fish pattern
 * @param {Number} paletteIndex A palette sample index
 * @constructor
 */
const LayerBase = function(paletteIndex) {
    Layer.call(this, -1, paletteIndex, false);
};

LayerBase.prototype = Object.create(Layer.prototype);

LayerBase.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
LayerBase.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Deserialize a base pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
LayerBase.deserialize = function(buffer) {
    return new LayerBase(buffer.readUint8());
};

/**
 * Serialize this base pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
LayerBase.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.paletteIndex);
};

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 * @param {Color} color The palette color
 */
LayerBase.prototype.configure = function(gl, program, color) {
    gl.uniform3f(program["uColor"], color.r, color.g, color.b);
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
LayerBase.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position"],
        ["color"]);
};