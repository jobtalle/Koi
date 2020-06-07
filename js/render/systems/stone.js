/**
 * Stone renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Stone = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "scale"],
        ["color", "position"]);
    this.programReflect = new Shader(
        gl,
        this.SHADER_VERTEX_REFLECT,
        this.SHADER_FRAGMENT,
        ["size", "scale"],
        ["color", "position"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.vaoReflect = gl.vao.createVertexArrayOES();

    Meshed.call(this, gl, [
        new Meshed.VAOConfiguration(
            this.vao,
            () => {
                gl.enableVertexAttribArray(this.program["aColor"]);
                gl.vertexAttribPointer(this.program["aColor"],
                    3, gl.FLOAT, false, 24, 0);
                gl.enableVertexAttribArray(this.program["aPosition"]);
                gl.vertexAttribPointer(this.program["aPosition"],
                    3, gl.FLOAT, false, 24, 12);
            }
        ),
        new Meshed.VAOConfiguration(
            this.vaoReflect,
            () => {
                gl.enableVertexAttribArray(this.programReflect["aColor"]);
                gl.vertexAttribPointer(this.programReflect["aColor"],
                    3, gl.FLOAT, false, 24, 0);
                gl.enableVertexAttribArray(this.programReflect["aPosition"]);
                gl.vertexAttribPointer(this.programReflect["aPosition"],
                    3, gl.FLOAT, false, 24, 12);
            }
        )
    ]);
};

Stone.prototype = Object.create(Meshed.prototype);

Stone.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform float scale;
uniform float zDirection;

attribute vec3 color;
attribute vec3 position;

varying vec3 iColor;

void main() {
  iColor = color;

  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy - vec2(0.0, position.z)) / size * scale + vec2(-1.0, 1.0),
    1.0 - position.y / size.y * scale,
    1.0);
}
`;

Stone.prototype.SHADER_VERTEX_REFLECT = `#version 100
uniform vec2 size;
uniform float scale;
uniform float zDirection;

attribute vec3 color;
attribute vec3 position;

varying vec3 iColor;

void main() {
  iColor = color;

  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy + vec2(0.0, position.z)) / size * scale + vec2(-1.0, 1.0),
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

/**
 * Render the stone
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Stone.prototype.render = function(width, height, scale) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);
    // TODO: Factor these out, premultiply mesh
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform1f(this.program["uScale"], scale);

    this.gl.enable(this.gl.CULL_FACE);
    this.renderMesh();
    this.gl.disable(this.gl.CULL_FACE);
};

/**
 * Render the stone reflections
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 * @param {Number} scale The render scale
 */
Stone.prototype.renderReflections = function(width, height, scale) {
    this.programReflect.use();
    this.gl.vao.bindVertexArrayOES(this.vaoReflect);

    this.gl.uniform2f(this.programReflect["uSize"], width, height);
    this.gl.uniform1f(this.programReflect["uScale"], scale);

    this.renderMesh();
};

/**
 * Free all resources maintained by the stone renderer
 */
Stone.prototype.free = function() {
    this.program.free();
    this.programReflect.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.gl.vao.deleteVertexArrayOES(this.vaoReflect);
};

