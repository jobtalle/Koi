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
        ["position", "origin", "alpha", "threshold"],
        ["window", "windowWidth", "transparency"],
        [
            new Shader.Constant("color", "f", this.COLOR.toArrayRGB())
        ]);
};

Drops.prototype.SHADER_VERTEX = `#version 100
uniform float window;
uniform float windowWidth;
uniform float transparency;

attribute vec3 position;
attribute vec2 origin;
attribute float alpha;
attribute float threshold;

varying float iAlpha;

void main() {
  mediump float age = mod(window - threshold, 1.0) / windowWidth;
  
  iAlpha = transparency * alpha * age;
  
  gl_Position = vec4(
    mix(vec2(origin.x, position.y - origin.y), vec2(position.x, position.y - position.z), age),
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
        3, this.gl.FLOAT, false, 28, 0);
    this.gl.enableVertexAttribArray(this.program["aOrigin"]);
    this.gl.vertexAttribPointer(this.program["aOrigin"],
        2, this.gl.FLOAT, false, 28, 12);
    this.gl.enableVertexAttribArray(this.program["aAlpha"]);
    this.gl.vertexAttribPointer(this.program["aAlpha"],
        1, this.gl.FLOAT, false, 28, 20);
    this.gl.enableVertexAttribArray(this.program["aThreshold"]);
    this.gl.vertexAttribPointer(this.program["aThreshold"],
        1, this.gl.FLOAT, false, 28, 24);
};

/**
 * Render the raindrops
 * @param {Number} count The number of drops in the current mesh
 * @param {Number} window The sliding window front in the range [0, 1]
 * @param {Number} windowWidth The sliding window width in the range [0, 1]
 * @param {Number} transparency The transparency factor in the range [0, 1]
 */
Drops.prototype.render = function(count, window, windowWidth, transparency) {
    this.program.use();

    this.gl.uniform1f(this.program["uWindow"], window);
    this.gl.uniform1f(this.program["uWindowWidth"], windowWidth);
    this.gl.uniform1f(this.program["uTransparency"], transparency);

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.depthMask(false);

    if (window > windowWidth)
        this.gl.drawArrays(
            this.gl.LINES,
            Math.floor(count * (window - windowWidth)) << 1,
            Math.ceil(count * windowWidth) << 1);
    else {
        this.gl.drawArrays(
            this.gl.LINES,
            0,
            Math.ceil(count * window) << 1);
        this.gl.drawArrays(
            this.gl.LINES,
            Math.floor(count * (window - windowWidth + 1)) << 1,
            Math.ceil(count * (1 - (window - windowWidth + 1))) << 1);
    }

    this.gl.depthMask(true);
};

/**
 * Free all resources maintained by the drops renderer
 */
Drops.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};