/**
 * A sand synthesizer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {RandomSource} randomSource A random source
 * @constructor
 */
const Sand = function(gl, randomSource) {
    this.gl = gl;
    this.randomSource = randomSource;
    this.buffer = gl.createBuffer();
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["scale", "color"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();

    this.gl.vao.bindVertexArrayOES(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW);

    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 2, gl.FLOAT, false, 8, 0);
};

Sand.prototype.COLOR = Color.fromCSS("sand");

Sand.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// TODO: Use 2D cubic noise
Sand.prototype.SHADER_FRAGMENT = `#version 100
` + CommonShaders.cubicNoise + `
uniform mediump float scale;
uniform lowp vec3 color;

void main() {
  lowp float noise = pow(random2(gl_FragCoord.xy), 9.0);
  lowp float hill = cubicNoise(vec3(1.5 * gl_FragCoord.xy / scale, 0.0));
  
  gl_FragColor = vec4(color * (noise * 0.4 * hill + 0.9), 1.0);
}
`;

/**
 * Write a sand texture
 * @param {Number} scale The render scale
 */
Sand.prototype.write = function(scale) {
    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.randomSource.texture);

    this.gl.uniform1f(this.program.uScale, scale);
    this.gl.uniform3f(this.program.uColor, this.COLOR.r, this.COLOR.g, this.COLOR.b);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by this system
 */
Sand.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};