/**
 * A base color for a fish pattern
 * @param {Palette.Sample} sample A palette sample
 * @constructor
 */
const LayerBase = function(sample) {
    Layer.call(this, -1, sample, false);
};

LayerBase.prototype = Object.create(Layer.prototype);

LayerBase.prototype.SHADER_VERTEX = `#version 100
uniform lowp vec3 color;

attribute vec2 position;

varying lowp vec3 iColor;

void main() {
  iColor = color;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
LayerBase.prototype.SHADER_FRAGMENT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 1.0);
}
`;

/**
 * Deserialize a base pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
LayerBase.deserialize = function(buffer) {
    return new LayerBase(Palette.Sample.deserialize(buffer));
};

/**
 * Serialize this base pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
LayerBase.prototype.serialize = function(buffer) {
    this.paletteSample.serialize(buffer);
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
        ["color"],
        ["position"]);
};