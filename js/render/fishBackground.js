/**
 * A background for fish card previews and fish codes
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const FishBackground = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["position"],
        ["region", "size"],
        [
            new Shader.Constant("colorInner", "f", this.COLOR_INNER.toArrayRGB()),
            new Shader.Constant("colorOuter", "f", this.COLOR_OUTER.toArrayRGB()),
            new Shader.Constant("gradientPower", "f", [this.GRADIENT_POWER])
        ]);
    this.buffer = gl.createBuffer();
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1, 1, 0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(this.program["aPosition"]);
    gl.vertexAttribPointer(this.program["aPosition"], 2, gl.FLOAT, false, 8, 0);
};

FishBackground.prototype.COLOR_INNER = Color.fromCSS("--color-preview-inner");
FishBackground.prototype.COLOR_OUTER = Color.fromCSS("--color-preview-outer");
FishBackground.prototype.GRADIENT_POWER = .37;

FishBackground.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform vec4 region;

attribute vec2 position;

varying vec2 iPosition;

void main() {
  iPosition = (position - vec2(0.5));
  
  gl_Position = vec4((position * (region.zw - region.xy) + region.xy) * 2.0 - vec2(1.0), 0.0, 1.0);
}
`;

FishBackground.prototype.SHADER_FRAGMENT = `#version 100
uniform lowp vec3 colorInner;
uniform lowp vec3 colorOuter;
uniform highp float gradientPower;

varying highp vec2 iPosition;

void main() {
  highp float dist = pow(min(1.0, length(iPosition) / 0.707106), gradientPower);
  
  gl_FragColor = vec4(mix(colorInner, colorOuter, dist), 1.0);
}
`;

/**
 * Render a fish background
 * @param {Number} width The width of the background in meters
 * @param {Number} height The height of the background in meters
 * @param {Number} [xStart] The X start in NDC space
 * @param {Number} [yStart] The Y start in NDC space
 * @param {Number} [xEnd] The X end in NDC space
 * @param {Number} [yEnd] The Y end in NDC space
 */
FishBackground.prototype.render = function(
    width,
    height,
    xStart = 0,
    yStart = 0,
    xEnd = 1,
    yEnd = 1) {
    this.program.use();

    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform4f(this.program["uRegion"], xStart, yStart, xEnd, yEnd);

    this.gl.vao.bindVertexArrayOES(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by the background renderer
 */
FishBackground.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};