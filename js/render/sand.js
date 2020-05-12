/**
 * A sand synthesizer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Sand = function(gl) {
    this.gl = gl;
    this.buffer = gl.createBuffer();
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size"],
        ["position", "uv"]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array([
            -1, -1, 0, 0,
            -1, 1, 0, 1,
            1, 1, 1, 1,
            1, -1, 1, 0
        ]),
        gl.STATIC_DRAW);
};

Sand.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;
attribute vec2 uv;

varying mediump vec2 iUv;

void main() {
  iUv = uv;
  
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

Sand.prototype.SHADER_FRAGMENT = `#version 100
uniform mediump vec2 size;

varying mediump vec2 iUv;

mediump float random(mediump vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
  mediump float lightness = 0.6 + 0.2 * pow(random(iUv * size), 4.5);
  gl_FragColor = vec4(vec2(lightness), 0.0, 1.0);
}
`;

/**
 * Write a sand texture
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 */
Sand.prototype.write = function(width, height) {
    this.program.use();

    this.gl.uniform2f(this.program.uSize, width, height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 2, this.gl.FLOAT, false, 16, 0);
    this.gl.enableVertexAttribArray(this.program.aUv);
    this.gl.vertexAttribPointer(this.program.aUv, 2, this.gl.FLOAT, false, 16, 8);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);
};

/**
 * Free all resources maintained by this system
 */
Sand.prototype.free = function() {
    this.gl.deleteBuffer(this.buffer);
    this.program.free();
};