/**
 * Stone renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Stone = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "scale"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.indexCount = -1;
};

Stone.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform float scale;

attribute vec2 position;

void main() {
  gl_Position = vec4(vec2(2.0, -2.0) * position / size * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

Stone.prototype.SHADER_FRAGMENT = `#version 100
void main() {
  gl_FragColor = vec4(vec3(0.7), 1.0);
}
`;

/**
 * Set the mesh for this stone renderer
 * @param {Mesh} mesh The mesh
 */
Stone.prototype.setMesh = function(mesh) {
    this.indexCount = mesh.indexCount;

    this.gl.vao.bindVertexArrayOES(this.vao);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 2, this.gl.FLOAT, false, 8, 0);
};

/**
 * Render the stone
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Stone.prototype.render = function(width, height, scale) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform2f(this.program.uSize, width, height);
    this.gl.uniform1f(this.program.uScale, scale);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by the stone renderer
 */
Stone.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};

