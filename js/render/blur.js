/**
 * A blur shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Blur = function(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "direction"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this.program.aPosition);
    gl.vertexAttribPointer(this.program.aPosition, 2, gl.FLOAT, false, 8, 0);
};

Blur.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Blur.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 size;
uniform mediump vec2 direction;

lowp vec4 get(int delta) {
  return texture2D(source, (gl_FragCoord.xy + direction * float(delta)) / size);
}S

void main() {
  gl_FragColor = (get(-2) + get(2)) * 0.06136 + (get(-1) + get(1)) * 0.24477 + get(0) * 0.38774;
}
`;

/**
 * Apply blur
 * @param {RenderTarget} target A render target to blur
 * @param {RenderTarget} intermediate An intermediate render target with the same properties as target
 */
Blur.prototype.apply = function(target, intermediate) {
    intermediate.target();

    this.program.use();

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform2f(this.program.uSize, target.width, target.height);
    this.gl.uniform2f(this.program.uDirection, 1, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, target.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    target.target();

    this.gl.uniform2f(this.program.uDirection, 0, 1);

    this.gl.bindTexture(this.gl.TEXTURE_2D, intermediate.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by this blur shader
 */
Blur.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};