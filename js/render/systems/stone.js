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
        ["color", "position"],
        ["filter"]);
    this.programReflect = new Shader(
        gl,
        this.SHADER_VERTEX_REFLECT,
        this.SHADER_FRAGMENT_REFLECT,
        ["color", "position"],
        []);
    this.programBase = new Shader(
        gl,
        this.SHADER_VERTEX_BASE,
        this.SHADER_FRAGMENT_BASE,
        ["position"],
        ["color"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.vaoReflect = gl.vao.createVertexArrayOES();
    this.vaoBase = gl.vao.createVertexArrayOES();
    this.filter = Color.WHITE;

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
        ),
        new Meshed.VAOConfiguration(
            this.vaoBase,
            () => {
                gl.enableVertexAttribArray(this.programBase["aPosition"]);
                gl.vertexAttribPointer(this.programBase["aPosition"],
                    3, gl.FLOAT, false, 24, 12);
            }
        )
    ]);

    this.setFilter(Color.WHITE);
};

Stone.prototype = Object.create(Meshed.prototype);

Stone.prototype.SHADER_VERTEX = `#version 100
attribute vec3 color;
attribute vec3 position;

varying vec3 iColor;

void main() {
  iColor = color;

  gl_Position = vec4(
    position.x,
    position.y - position.z,
    0.5 * position.y + 0.5,
    1.0);
}
`;

Stone.prototype.SHADER_VERTEX_REFLECT = `#version 100
attribute vec3 color;
attribute vec3 position;

varying vec3 iColor;

void main() {
  iColor = color;

  gl_Position = vec4(
    vec2(position.x, position.y + position.z),
    0.5 * position.y + 0.5,
    1.0);
}
`;

Stone.prototype.SHADER_VERTEX_BASE = `#version 100
attribute vec3 position;

void main() {
  gl_Position = vec4(
    vec2(position.x, position.y),
    0.0,
    1.0);
}
`;

Stone.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 filter;

varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor * filter, 1.0);
}
`;

Stone.prototype.SHADER_FRAGMENT_REFLECT = `#version 100
varying lowp vec3 iColor;

void main() {
  gl_FragColor = vec4(iColor, 1.0);
}
`;

Stone.prototype.SHADER_FRAGMENT_BASE = `#version 100
uniform lowp vec4 color;

void main() {
  gl_FragColor = color;
}
`;

/**
 * Set the filtering color
 * @param {Color} filter The filtering color
 */
Stone.prototype.setFilter = function(filter) {
    this.filter = filter;
};

/**
 * Render the stone
 */
Stone.prototype.render = function() {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    if (this.filter !== null) {
        this.gl.uniform3f(
            this.program["uFilter"],
            this.filter.r,
            this.filter.g,
            this.filter.b);

        this.filter = null;
    }

    this.gl.enable(this.gl.CULL_FACE);
    this.renderMesh();
    this.gl.disable(this.gl.CULL_FACE);
};

/**
 * Render the stone reflections
 */
Stone.prototype.renderReflections = function() {
    this.programReflect.use();
    this.gl.vao.bindVertexArrayOES(this.vaoReflect);

    this.renderMesh();
};

/**
 * Render the base of the rocks as black polygons
 * @param {Color} color The polygon color
 */
Stone.prototype.renderBase = function(color) {
    this.programBase.use();
    this.gl.vao.bindVertexArrayOES(this.vaoBase);

    this.gl.uniform4f(this.programBase["uColor"], color.r, color.g, color.b, color.a);

    this.renderMesh();
};

/**
 * Free all resources maintained by the stone renderer
 */
Stone.prototype.free = function() {
    this.program.free();
    this.programReflect.free();
    this.programBase.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.gl.vao.deleteVertexArrayOES(this.vaoReflect);
    this.gl.vao.deleteVertexArrayOES(this.vaoBase);
};

