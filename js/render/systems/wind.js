/**
 * The wind system
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Quad} quad A quad renderer
 * @constructor
 */
const Wind = function(gl, quad) {
    this.gl = gl;
    this.quad = quad; // TODO: Add shaderless render function to quad instead of stealing buffer
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
 * Propagate air influences over an air plane
 * @param {Air} air The air
 */
Wind.prototype.propagate = function(air) {

};

/**
 * Free the wind system
 */
Wind.prototype.free = function() {
    this.program.free();
};