/**
 * The post processing renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Quad} quad A quad renderer to lend a mesh from
 * @constructor
 */
const Post = function(gl, quad) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position"],
        ["size"]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);

    gl.enableVertexAttribArray(this.program["aPosition"]);
    gl.vertexAttribPointer(this.program["aPosition"], 2, gl.FLOAT, false, 8, 0);
};

Post.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Post.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 size;

void main() {
  gl_FragColor = texture2D(source, gl_FragCoord.xy / size);
}
`;

/**
 * Render post processing
 * @param {WebGLTexture} texture The buffer to render from
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 */
Post.prototype.render = function(texture, width, height) {
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.program.use();

    this.gl.uniform2f(this.program["uSize"], width, height);

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources
 */
Post.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};