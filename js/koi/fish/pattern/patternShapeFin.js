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
  mediump float angle = atan(iUv.y, iUv.x);
  mediump float factor = pow(angle / 1.570796, 1.0);
  
  if (length(iUv) > pow(sin(3.141592 * factor), 0.05))
    gl_FragColor = vec4(0.0);
  else
    gl_FragColor = vec4(0.7);
}
`;

/**
 * Deserialize this pattern
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
PatternShapeFin.deserialize = function(buffer) {
    return new PatternShapeFin();
};

/**
 * Serialize this pattern
 * @param {BinBuffer} buffer A buffer to serialize to
 */
PatternShapeFin.prototype.serialize = function(buffer) {

};

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
        ["position", "uv"]);
};