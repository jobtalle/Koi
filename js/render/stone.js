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
        ["color", "lightness", "position"]);
    this.programReflect = new Shader(
        gl,
        this.SHADER_VERTEX_REFLECT,
        this.SHADER_FRAGMENT_REFLECT,
        ["size", "scale"],
        ["color", "lightness", "position"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.indexCount = -1;
};

Stone.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform float scale;
uniform float zDirection;

attribute vec3 color;
attribute float lightness;
attribute vec3 position;

varying vec3 iColor;

void main() {
  iColor = color * lightness;

  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy - vec2(0.0, position.z)) / size * scale + vec2(-1.0, 1.0),
    1.0 - position.y / size.y * scale,
    1.0);
}
`;

Stone.prototype.SHADER_FRAGMENT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 1.0);
}
`;

Stone.prototype.SHADER_VERTEX_REFLECT = `#version 100
uniform vec2 size;
uniform float scale;
uniform float zDirection;

attribute vec3 color;
attribute float lightness;
attribute vec3 position;

varying vec3 iColor;

void main() {
  iColor = color * lightness;

  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy + vec2(0.0, position.z)) / size * scale + vec2(-1.0, 1.0),
    1.0 - position.y / size.y * scale,
    1.0);
}
`;

Stone.prototype.SHADER_FRAGMENT_REFLECT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 1.0);
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

    this.gl.enableVertexAttribArray(this.program.aColor);
    this.gl.vertexAttribPointer(this.program.aColor, 3, this.gl.FLOAT, false, 28, 0);
    this.gl.enableVertexAttribArray(this.program.aLightness);
    this.gl.vertexAttribPointer(this.program.aLightness, 1, this.gl.FLOAT, false, 28, 12);
    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 3, this.gl.FLOAT, false, 28, 16);
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
 * Render the stone reflections
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Stone.prototype.renderReflections = function(width, height, scale) {
    this.programReflect.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform2f(this.programReflect.uSize, width, height);
    this.gl.uniform1f(this.programReflect.uScale, scale);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by the stone renderer
 */
Stone.prototype.free = function() {
    this.program.free();
    this.programReflect.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};

