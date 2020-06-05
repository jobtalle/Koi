/**
 * The vegetation renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Vegetation = function(gl) {
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "scale", "airBack", "airFront", "time"],
        ["color", "position", "flex", "windPosition"]);
    this.programReflect = new Shader(
        gl,
        this.SHADER_VERTEX_REFLECT,
        this.SHADER_FRAGMENT_REFLECT,
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
                    3, gl.FLOAT, false, 40, 0);
                gl.enableVertexAttribArray(this.program["aPosition"]);
                gl.vertexAttribPointer(this.program["aPosition"],
                    3, gl.FLOAT, false, 40, 12);
                gl.enableVertexAttribArray(this.program["aFlex"]);
                gl.vertexAttribPointer(this.program["aFlex"],
                    2, gl.FLOAT, false, 40, 24);
                gl.enableVertexAttribArray(this.program["aWindPosition"]);
                gl.vertexAttribPointer(this.program["aWindPosition"],
                    2, gl.FLOAT, false, 40, 32);
            }
        ),
        new Meshed.VAOConfiguration(
            this.vaoReflect,
            () => {
                gl.enableVertexAttribArray(this.programReflect["aColor"]);
                gl.vertexAttribPointer(this.programReflect["aColor"],
                    3, gl.FLOAT, false, 40, 0);
                gl.enableVertexAttribArray(this.programReflect["aPosition"]);
                gl.vertexAttribPointer(this.programReflect["aPosition"],
                    3, gl.FLOAT, false, 40, 12);
            }
        )
    ]);
};

Vegetation.prototype = Object.create(Meshed.prototype);

Vegetation.prototype.SHADER_VERTEX = `#version 100
uniform sampler2D airBack;
uniform sampler2D airFront;
uniform float time;
uniform vec2 size;
uniform float scale;

attribute vec3 color;
attribute vec3 position;
attribute vec2 flex;
attribute vec2 windPosition;

varying vec3 iColor;

void main() {
  iColor = color;
  
  vec2 uv = windPosition / size * scale;
  float displacement = mix(
    texture2D(airBack, vec2(uv.x, 1.0 - uv.y)).r * 2.0 - 1.0,
    texture2D(airFront, vec2(uv.x, 1.0 - uv.y)).r * 2.0 - 1.0,
    time);    
  
  gl_Position = vec4(
    vec2(2.0, -2.0) * (position.xy - vec2(0.0, position.z) + flex * displacement) / size * scale + vec2(-1.0, 1.0),
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
 * Render a mesh as vegetation
 * @param {Air} air An air object to displace vegetation with
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 * @param {Number} time The interpolation factor
 */
Vegetation.prototype.render = function(air, width, height, scale, time) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, air.getBack().texture);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, air.getFront().texture);

    this.gl.uniform1i(this.program["uAirBack"], 0);
    this.gl.uniform1i(this.program["uAirFront"], 1);
    this.gl.uniform1f(this.program["uTime"], time);
    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform1f(this.program["uScale"], scale);

    this.renderMesh();
};

/**
 * Render vegetation reflections
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The scale
 */
Vegetation.prototype.renderReflections = function(width, height, scale) {
    this.programReflect.use();
    this.gl.vao.bindVertexArrayOES(this.vaoReflect);

    this.gl.uniform2f(this.programReflect["uSize"], width, height);
    this.gl.uniform1f(this.programReflect["uScale"], scale);

    this.renderMesh();
};

/**
 * Free all resources maintained by the vegetation renderer
 */
Vegetation.prototype.free = function() {
    this.program.free();
    this.programReflect.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.gl.vao.deleteVertexArrayOES(this.vaoReflect);
};