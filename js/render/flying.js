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
        ["position", "positionFlap", "color", "flapShade"],
        ["scale", "center", "windCenter", "flex", "flap", "time"]);
    this.vao = gl.vao.createVertexArrayOES();
};

Flying.prototype.SHADER_VERTEX =  `#version 100
uniform sampler2D air;
uniform vec2 scale;
uniform vec3 center;
uniform vec2 windCenter;
uniform vec2 flex;
uniform float flap;
uniform float time;

attribute vec2 position;
attribute vec2 positionFlap;
attribute vec3 color;
attribute float flapShade;

varying vec3 iColor;

void main() {
  iColor = mix(color, color * flapShade, flap);
  
  vec2 flappedPosition = mix(position, positionFlap, flap);
  vec2 states = texture2D(air, windCenter).ar;
  float displacement = mix(states.x, states.y, time) * 2.0 - 1.0;
  
  gl_Position = vec4(
    (vec2(
      center.x + flappedPosition.x,
      center.y - flappedPosition.y - center.z) + flex * displacement) * scale + vec2(-1.0, 1.0),
    0.5 * center.y * scale.y + 1.0,
    1.0);
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
    this.gl.vertexAttribPointer(this.program["aPosition"], 2, this.gl.FLOAT, false, 32, 0);
    this.gl.enableVertexAttribArray(this.program["aPositionFlap"]);
    this.gl.vertexAttribPointer(this.program["aPositionFlap"], 2, this.gl.FLOAT, false, 32, 8);
    this.gl.enableVertexAttribArray(this.program["aColor"]);
    this.gl.vertexAttribPointer(this.program["aColor"], 3, this.gl.FLOAT, false, 32, 16);
    this.gl.enableVertexAttribArray(this.program["aFlapShade"]);
    this.gl.vertexAttribPointer(this.program["aFlapShade"], 1, this.gl.FLOAT, false, 32, 28);

    return vao;
};

/**
 * Render flying animals
 * @param {WebGLVertexArrayObjectOES} vao The VAO to render
 * @param {Mesh} mesh The mesh to render
 * @param {Vector3} position The position
 * @param {Vector2} windPosition The wind position
 * @param {Vector2} flex The flex vector at the target position
 * @param {Number} flap The flap amount at the current time
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @param {Air} air The air
 * @param {Number} time The time interpolation factor
 */
Flying.prototype.render = function(
    vao,
    mesh,
    position,
    windPosition,
    flex,
    flap,
    width,
    height,
    air,
    time) {
    this.gl.vao.bindVertexArrayOES(vao);
    this.program.use();

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, air.getFront().texture);

    this.gl.uniform2f(this.program["uScale"], 2 / width, -2 / height);
    this.gl.uniform3f(this.program["uCenter"], position.x, position.y, position.z);
    this.gl.uniform2f(this.program["uWindCenter"], windPosition.x, windPosition.y);
    this.gl.uniform2f(this.program["uFlex"], flex.x, flex.y);
    this.gl.uniform1f(this.program["uFlap"], flap);
    this.gl.uniform1f(this.program["uTime"], time);
    this.gl.drawElements(this.gl.TRIANGLES, mesh.elementCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by this system
 */
Flying.prototype.free = function() {

};