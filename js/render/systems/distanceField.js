/**
 * A distance field renderer
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Quad} quad The quad renderer to borrow the quad mesh from
 * @constructor
 */
const DistanceField = function(gl, quad) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "range"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();

    gl.vao.bindVertexArrayOES(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer);

    gl.enableVertexAttribArray(this.program["aPosition"]);
    gl.vertexAttribPointer(this.program["aPosition"], 2, gl.FLOAT, false, 8, 0);
};

DistanceField.prototype.SHADER_VERTEX = `#version 100
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

DistanceField.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 size;
uniform mediump float range;

mediump float get(int dx, int dy) {
  return texture2D(source, (gl_FragCoord.xy + vec2(float(dx), float(dy))) / size).a;
}

void main() {
  mediump float nearest = min(
    min(
      min(
        get(-1, -1),
        get(1, -1)),
      min(
        get(-1, 1),
        get(1, 1))) + 1.414213 * range,
    min(
      min(
        get(0, -1),
        get(1, 0)),
      min(
        get(0, 1),
        get(-1, 0))) + range);
  
  gl_FragColor = vec4(min(texture2D(source, gl_FragCoord.xy / size).r, nearest));
}
`;

/**
 * Make a distance field
 * @param {WebGLTexture} texture A texture to create a distance field from, with objects as black pixels
 * @param {Number} width The texture width in pixels
 * @param {Number} height The texture height in pixels
 * @param {Number} range The range of the distance field
 * @returns {WebGLTexture} The distance field
 */
DistanceField.prototype.make = function(texture, width, height, range) {
    const buffers = [
        new RenderTarget(this.gl, width, height, this.gl.RGBA, false, this.gl.NEAREST),
        new RenderTarget(this.gl, width, height, this.gl.RGBA, false, this.gl.NEAREST)];
    let front = 0;

    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform2f(this.program["uSize"], width, height);
    this.gl.uniform1f(this.program["uRange"], 1 / range);

    for (let step = 0; step < range; ++step) {
        buffers[front].target();

        this.gl.activeTexture(this.gl.TEXTURE0);

        if (step === 0)
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        else
            this.gl.bindTexture(this.gl.TEXTURE_2D, buffers[1 - front].texture);

        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

        front = 1 - front;
    }

    buffers[front].free();

    this.gl.bindTexture(this.gl.TEXTURE_2D, buffers[1 - front].texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return buffers[1 - front].extractTexture();
};

/**
 * Free all resources maintained by the distance field renderer
 */
DistanceField.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};