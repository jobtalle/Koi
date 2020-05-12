/**
 * A wave simulation shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Waves = function(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size"],
        ["position"]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW);
};

Waves.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Waves.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D background;
uniform mediump vec2 size;

void main() {
  gl_FragColor = texture2D(background, gl_FragCoord.xy / size) * 0.5;
}
`;

/**
 * Propagate the waves on a water plane
 * @param {WaterPlane} water A water plane
 */
Waves.prototype.propagate = function(water) {
    // TODO
};

/**
 * Render waves
 * @param {WebGLTexture} background A background texture
 * @param {WaterPlane} water A water plane to shade the background with
 * @param {Number} width The background width in pixels
 * @param {Number} height The background height in pixels
 */
Waves.prototype.render = function(background, water, width, height) {
    this.program.use();

    this.gl.uniform2f(this.program.uSize, width, height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 2, this.gl.FLOAT, false, 8, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, background);
    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, water.getFront().texture);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by this object
 */
Waves.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.program.free();
};