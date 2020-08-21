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
        ["position", "alpha", "threshold", "distance"],
        ["window", "windowWidth"],
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
uniform float window;
uniform float windowWidth;

attribute vec3 position;
attribute float alpha;
attribute float threshold;
attribute float distance;

varying float iAlpha;

void main() {
  mediump float age = (window - threshold) / windowWidth;
  mediump float raise = 1.0 - age;
  
  iAlpha = alpha * sqrt(age);
  
  gl_Position = vec4(
    position.xy + direction * (position.z - raise * distance),
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
        3, this.gl.FLOAT, false, 24, 0);
    this.gl.enableVertexAttribArray(this.program["aAlpha"]);
    this.gl.vertexAttribPointer(this.program["aAlpha"],
        1, this.gl.FLOAT, false, 24, 12);
    this.gl.enableVertexAttribArray(this.program["aThreshold"]);
    this.gl.vertexAttribPointer(this.program["aThreshold"],
        1, this.gl.FLOAT, false, 24, 16);
    this.gl.enableVertexAttribArray(this.program["aDistance"]);
    this.gl.vertexAttribPointer(this.program["aDistance"],
        1, this.gl.FLOAT, false, 24, 20);
};

/**
 * Render the raindrops
 */
Drops.prototype.render = function(count, window, windowWidth) {
    const start = window < windowWidth ? window - windowWidth + 1 : window - windowWidth;
    const end = window;

    this.program.use();

    this.gl.uniform1f(this.program["uWindow"], window);
    this.gl.uniform1f(this.program["uWindowWidth"], windowWidth);

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.depthMask(false);

    // if (end < start)
    //     console.log("split");
    // else
    //     this.gl.drawArrays(
    //         this.gl.LINES,
    //         Math.floor(count * start) << 1,
    //         Math.ceil(count * end) << 1);

    this.gl.drawArrays(this.gl.LINES, 0, Math.ceil(count * end) << 1);

    this.gl.depthMask(true);
};

/**
 * Free all resources maintained by the drops renderer
 */
Drops.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};