/**
 * A full screen quad renderer
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Blit} blit The blit system
 * @constructor
 */
const Quad = function(gl, blit) {
    this.gl = gl;
    this.blit = blit;
    this.buffer = gl.createBuffer();
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.blit.program["aPosition"]);
    gl.vertexAttribPointer(this.blit.program["aPosition"], 2, gl.FLOAT, false, 8, 0);
};

/**
 * Render a fullscreen quad of a given texture
 * @param {WebGLTexture} texture A texture
 */
Quad.prototype.render = function(texture) {
    this.blit.program.use();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free the quad renderer
 */
Quad.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.gl.vao.deleteVertexArrayOES(this.vao);
};