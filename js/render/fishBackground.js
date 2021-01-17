/**
 * A background for fish card previews and fish codes
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Quad} quad The quad renderer to borrow the buffer from
 * @constructor
 */
const FishBackground = function(gl, quad) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position"],
        ["region"],
        [
            new Shader.Constant("colorInner", "f", this.COLOR_INNER.toArrayRGB()),
            new Shader.Constant("colorOuter", "f", this.COLOR_OUTER.toArrayRGB())
        ]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);
    gl.enableVertexAttribArray(this.program["aPosition"]);
    gl.vertexAttribPointer(this.program["aPosition"], 2, gl.FLOAT, false, 8, 0);
};

FishBackground.prototype.COLOR_INNER = Color.fromCSS("--color-preview-inner");
FishBackground.prototype.COLOR_OUTER = Color.fromCSS("--color-preview-outer");

FishBackground.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

varying vec2 iUv;

void main() {
  iUv = position * 0.5 + 0.5;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

FishBackground.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 colorInner;
uniform lowp vec3 colorOuter;

varying mediump vec2 iUv;

void main() {
  gl_FragColor = vec4(colorInner, 1.0);
}
`;

/**
 * Render a fish background
 */
FishBackground.prototype.render = function() {
    this.program.use();

    this.gl.vao.bindVertexArrayOES(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by the background renderer
 */
FishBackground.prototype.free = function() {
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};