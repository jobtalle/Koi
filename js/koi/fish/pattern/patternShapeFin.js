/**
 * A fish fin shape which will be superimposed over a pattern
 * @constructor
 */
const PatternShapeFin = function() {

};

PatternShapeFin.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

PatternShapeFin.prototype.SHADER_FRAGMENT = `#version 100
varying mediump vec2 iUv;

void main() {
  if (length(iUv) > 1.0)
    gl_FragColor = vec4(0.0);
  else
    gl_FragColor = vec4(1.0);
}
`;

/**
 * Configure this pattern to a shader
 * @param {WebGLRenderingContext} gl A webGL context
 * @param {Shader} program A shader program created from this patterns' shaders
 */
PatternShapeFin.prototype.configure = function(gl, program) {

};

/**
 * Create the shader for this pattern
 * @param {WebGLRenderingContext} gl A webGL context
 * @returns {Shader} The shader program
 */
PatternShapeFin.prototype.createShader = function(gl) {
    return new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        [],
        []);
};