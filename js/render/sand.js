/**
 * A sand synthesizer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Sand = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        [],
        []);
};

Sand.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec(position, 0.0, 1.0);
}
`;

Sand.prototype.SHADER_FRAGMENT = `#version 100
void main() {
  gl_FragColor = vec4(1.0);
}
`;

/**
 * Write a sand texture
 * @param {Primitives} primitives The primitives renderer
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 */
Sand.prototype.write = function(primitives, width, height) {

};

/**
 * Free all resources maintained by this system
 */
Sand.prototype.free = function() {
    this.program.free();
};