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
        ["size", "scale"],
        ["color", "position", "flexibility"]);
    this.programReflect = new Shader(
        gl,
        this.SHADER_VERTEX_REFLECT,
        this.SHADER_FRAGMENT_REFLECT,
        ["size", "scale"],
        ["color", "position", "flexibility"]);

    this.indexCount = -1;
    this.vao = gl.vao.createVertexArrayOES();
};

Vegetation.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform float scale;

attribute vec3 color;
attribute vec3 position;
attribute float flexibility;

varying vec3 iColor;

void main() {
  iColor = color;
  
  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy - vec2(0.0, position.z)) / size * scale + vec2(-1.0, 1.0),
    1.0 - position.y / size.y * scale,
    1.0);
}
`;

Vegetation.prototype.SHADER_FRAGMENT = `#version 100
varying lowp vec3 iColor;

void main() {
    gl_FragColor = vec4(iColor, 1.0);
}
`;

Vegetation.prototype.SHADER_VERTEX_REFLECT = `#version 100
uniform vec2 size;
uniform float scale;

attribute vec3 color;
attribute vec3 position;
attribute float flexibility;

varying vec3 iColor;

void main() {
  iColor = color;
  
  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy + vec2(0.0, position.z)) / size * scale + vec2(-1.0, 1.0),
    1.0 - position.y / size.y * scale,
    1.0);
}
`;

Vegetation.prototype.SHADER_FRAGMENT_REFLECT = `#version 100
varying lowp vec3 iColor;

void main() {
    gl_FragColor = vec4(iColor, 1.0);
}
`;

/**
 * Set the mesh
 * @param {Mesh} mesh The mesh
 */
Vegetation.prototype.setMesh = function(mesh) {
    this.indexCount = mesh.indexCount;

    this.gl.vao.bindVertexArrayOES(this.vao);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.program.aColor);
    this.gl.vertexAttribPointer(this.program.aColor, 3, this.gl.FLOAT, false, 28, 0);
    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 3, this.gl.FLOAT, false, 28, 12);
    // this.gl.enableVertexAttribArray(this.program.aFlexibility);
    // this.gl.vertexAttribPointer(this.program.aFlexibility, 1, this.gl.FLOAT, false, 24, 16);
};

/**
 * Render a mesh as vegetation
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Vegetation.prototype.render = function(width, height, scale) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform2f(this.program.uSize, width, height);
    this.gl.uniform1f(this.program.uScale, scale);

    // TODO: Creates GL_INVALID_OPERATION insufficient buffer sometimes
    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by the vegetation renderer
 */
Vegetation.prototype.free = function() {
    this.program.free();
    this.programReflect.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};