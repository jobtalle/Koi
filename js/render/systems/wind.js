/**
 * The wind system
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Wind = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        [],
        []);
};

Wind.prototype.SHADER_VERTEX = `#version 100

`;

Wind.prototype.SHADER_FRAGMENT = `#version 100

`;

/**
 * Free the wind system
 */
Wind.prototype.free = function() {
    this.program.free();
};