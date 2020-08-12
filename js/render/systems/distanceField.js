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
        ["size"],
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

#define DIST 23

mediump float get(int dx, int dy) {
  return texture2D(source, (gl_FragCoord.xy + vec2(float(dx), float(dy))) / size).r;
}

void main() {
  mediump float furthest = 1.0;
  
  for (int dy = -DIST; dy <= DIST; ++dy) for (int dx = -DIST; dx <= DIST; ++dx) {
    mediump float value = get(dx, dy) + length(vec2(float(dx), float(dy))) / float(DIST);
    
    if (value < furthest)
      furthest = value;
  }
  
  gl_FragColor = vec4(vec3(furthest), 1.0);
}
`;

/**
 * Make a distance field
 * @param {WebGLTexture} texture A texture to create a distance field from, with objects as black pixels
 * @param {Number} width The texture width in pixels
 * @param {Number} height The texture height in pixels
 * @returns {WebGLTexture} The distance field
 */
DistanceField.prototype.make = function(texture, width, height) {
    const renderTarget = new RenderTarget(this.gl, width, height, this.gl.RGBA, false, this.gl.NEAREST);

    renderTarget.target();

    this.program.use();
    this.gl.vao.bindVertexArrayOES(this.vao);
    // TODO: Use two buffers for dynamic distance
    this.gl.uniform2f(this.program["uSize"], width, height);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, 4);

    this.gl.bindTexture(this.gl.TEXTURE_2D, renderTarget.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    return renderTarget.extractTexture();
};

/**
 * Free all resources maintained by the distance field renderer
 */
DistanceField.prototype.free = function() {
    this.program.free();
    this.gl.vao.deleteVertexArrayOES(this.vao);
};