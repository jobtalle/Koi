/**
 * The vegetation renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Vegetation = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        [],
        ["color", "position", "flexibility"]);
};

Vegetation.prototype.SHADER_VERTEX = `#version 100
uniform mediump float scale;

attribute vec3 color;
attribute vec2 position;
attribute float flexibility;

void main() {
    gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
}
`;

Vegetation.prototype.SHADER_FRAGMENT = `#version 100
void main() {
    gl_FragColor = vec4(1.0);
}
`;

/**
 * Render a mesh as vegetation
 * @param {Mesh} mesh A mesh containing vegetation attributes
 */
Vegetation.prototype.render = function(mesh) {

};

/**
 * Free all resources maintained by the vegetation renderer
 */
Vegetation.prototype.free = function() {
    this.program.free();
};