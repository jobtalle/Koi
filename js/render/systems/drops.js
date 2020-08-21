/**
 * The raindrop renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Drops = function(gl) {
    this.gl = gl;
    this.vao = gl.vao.createVertexArrayOES();
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position", "alpha"],
        [],
        [
            new Shader.Constant("direction", "f", [
                this.DIRECTION.x,
                this.DIRECTION.y]),
            new Shader.Constant("color", "f", [
                this.COLOR.r,
                this.COLOR.g,
                this.COLOR.b])
        ]);
};

Drops.prototype.SHADER_VERTEX = `#version 100
uniform vec2 direction;

attribute vec3 position;
attribute float alpha;

varying float iAlpha;

void main() {
  iAlpha = alpha;
  
  gl_Position = vec4(
    position.xy - direction * position.z,
    0.5 * position.y + 0.5,
    1.0);
}
`;

Drops.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 color;

varying lowp float iAlpha;

void main() {
  gl_FragColor = vec4(color, iAlpha);
}
`;

Drops.prototype.DIRECTION = new Vector2(1, 5).normalize();
Drops.prototype.COLOR = Color.fromCSS("--color-rain");

/**
 * Set the rain mesh
 * @param {WebGLBuffer} mesh A buffer containing all rain vertices
 */
Drops.prototype.setMesh = function(mesh) {
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh);

    this.gl.enableVertexAttribArray(this.program["aPosition"]);
    this.gl.vertexAttribPointer(this.program["aPosition"],
        3, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(this.program["aAlpha"]);
    this.gl.vertexAttribPointer(this.program["aAlpha"],
        1, this.gl.FLOAT, false, 16, 12);
};

/**
 * Render the raindrops
 */
Drops.prototype.render = function(count) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.drawArrays(this.gl.LINES, 0, count << 1);
};

/**
 * Free all resources maintained by the drops renderer
 */
Drops.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};