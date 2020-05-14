/**
 * A base color for a fish pattern
 * @param {Color} color A color
 * @constructor
 */
const PatternBase = function(color) {
    this.color = color;
    // TODO: Wouldn't a glClear with scissor not suffice here? Doesn't warrant a shader.
};

PatternBase.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
PatternBase.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
PatternBase.prototype.configure = function(gl, program) {
    gl.uniform3f(program.uColor, this.color.r, this.color.g, this.color.b);
};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
PatternBase.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["color"],
        ["position"]);
};