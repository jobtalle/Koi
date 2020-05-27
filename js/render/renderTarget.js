/**
 * A texture that can be rendered to
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {GLenum} format The texture data format
 * @param {GLenum} [filter] Texture filtering method
 * @constructor
 */
const RenderTarget = function(
    gl,
    width,
    height,
    format,
    filter = null) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.framebuffer = gl.createFramebuffer();
    this.texture = this.createTexture(format, filter);
};

/**
 * Set this bufferQuad as render target
 */
RenderTarget.prototype.target = function() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
};

/**
 * Create the texture for this underwater bufferQuad
 * @param {GLenum} format The texture data format
 * @param {GLenum} filter Texture filtering method
 * @returns {WebGLTexture} A WebGL texture
 */
RenderTarget.prototype.createTexture = function(format, filter) {
    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    if (filter !== null) {
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, filter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, filter);
    }

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        format,
        this.width,
        this.height,
        0,
        format,
        this.gl.UNSIGNED_BYTE,
        null);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    return texture;
};

/**
 * Free all resources maintained by this bufferQuad
 */
RenderTarget.prototype.free = function() {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);
};