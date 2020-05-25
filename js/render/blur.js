/**
 * A blur shader
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @constructor
 */
const Blur = function(gl) {
    this.gl = gl;
    this.program = new Shader(
        gl,
        this.SHADER_VERTEX,
        this.SHADER_FRAGMENT,
        ["size", "scale", "targetSize", "direction"],
        ["position"]);
    this.vao = gl.vao.createVertexArrayOES();
    this.indexCount = -1;
};

Blur.prototype.SHADER_VERTEX = `#version 100
uniform vec2 size;
uniform float scale;

attribute vec2 position;

void main() {
  gl_Position = vec4(vec2(2.0, -2.0) * position / size * scale + vec2(-1.0, 1.0), 0.0, 1.0);
}
`;

Blur.prototype.SHADER_FRAGMENT = `#version 100
uniform sampler2D source;
uniform mediump vec2 targetSize;
uniform mediump vec2 direction;

lowp vec4 get(int delta) {
  return texture2D(source, (gl_FragCoord.xy + direction * float(delta)) / targetSize);
}

void main() {
  gl_FragColor = (get(-2) + get(2)) * 0.06136 + (get(-1) + get(1)) * 0.24477 + get(0) * 0.38774;
}
`;

/**
 * Set the mesh for the blur shader
 * @param {Mesh} mesh The mesh containing depth values
 */
Blur.prototype.setMesh = function(mesh) {
    this.indexCount = mesh.indexCount;

    this.gl.vao.bindVertexArrayOES(this.vao);

    mesh.bindBuffers();

    this.gl.enableVertexAttribArray(this.program.aPosition);
    this.gl.vertexAttribPointer(this.program.aPosition, 2, this.gl.FLOAT, false, 8, 0);
};

/**
 * Apply blur
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @param {Number} scale The render scale
 * @param {RenderTarget} target A render target to blur
 * @param {RenderTarget} intermediate An intermediate render target with the same properties as target
 */
Blur.prototype.apply = function(width, height, scale, target, intermediate) {
    intermediate.target();

    this.program.use();

    this.gl.vao.bindVertexArrayOES(this.vao);

    this.gl.uniform2f(this.program.uSize, width, height);
    this.gl.uniform1f(this.program.uScale, scale);
    this.gl.uniform2f(this.program.uTargetSize, target.width, target.height);
    this.gl.uniform2f(this.program.uDirection, 1, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, target.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);

    target.target();

    this.gl.uniform2f(this.program.uDirection, 0, 1);

    this.gl.bindTexture(this.gl.TEXTURE_2D, intermediate.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
};

/**
 * Free all resources maintained by this blur shader
 */
Blur.prototype.free = function() {
    this.gl.vao.deleteVertexArrayOES(this.vao);
    this.program.free();
};