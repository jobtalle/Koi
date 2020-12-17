/**
 * Flying animals
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Flying = function(gl) {
    // TODO: Add ambient uniform
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "color"],
        ["scale", "center"]);
    this.vao = gl.vao.createVertexArrayOES();
};

Flying.prototype.SHADER_VERTEX =  `#version 100
uniform vec2 scale;
uniform vec3 center;

attribute vec3 position;
attribute vec3 color;

varying vec3 iColor;

void main() {
  iColor = color;
  
  gl_Position = vec4((position.xy + center.xy) * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

Flying.prototype.SHADER_FRAGMENT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 1.0);
}
`;

/**
 * Register a mesh for use as a flying animal and return the VAO for it
 * @param {Mesh} mesh Mesh
 * @returns {WebGLVertexArrayObjectOES} The VAO
 */
Flying.prototype.register = function(mesh) {
    const vao = this.gl.vao.createVertexArrayOES();

    this.gl.vao.bindVertexArrayOES(vao);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.program["aPosition"]);
    this.gl.vertexAttribPointer(this.program["aPosition"], 3, this.gl.FLOAT, false, 24, 0);
    this.gl.enableVertexAttribArray(this.program["aColor"]);
    this.gl.vertexAttribPointer(this.program["aColor"], 3, this.gl.FLOAT, false, 24, 12);

    return vao;
};

/**
 * Render flying animals
 * @param {WebGLVertexArrayObjectOES} vao The VAO to render
 * @param {Mesh} mesh The mesh to render
 * @param {Vector3} position The position
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Air} air The air
 */
Flying.prototype.render = function(
    vao,
    mesh,
    position,
    width,
    height,
    air) {
    this.gl.vao.bindVertexArrayOES(vao);
    this.program.use();

    this.gl.uniform2f(this.program["uScale"], 2 / width, -2 / height);
    this.gl.uniform3f(this.program["uCenter"], position.x, position.y, position.z);
    this.gl.drawElements(this.gl.TRIANGLES, mesh.elementCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by this system
 */
Flying.prototype.free = function() {

};