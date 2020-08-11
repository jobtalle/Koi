/**
 * A texture that can be rendered to
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {GLenum} format The texture data format
 * @param {Boolean} depth A boolean indicating whether to include a depth buffer
 * @param {GLenum} [filter] Texture filtering method
 * @constructor
 */
const RenderTarget = function(
    gl,
    width,
    height,
    format,
    depth,
    filter = null) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.framebuffer = gl.createFramebuffer();
    this.texture = this.createTexture(width, height, format, depth, filter);
    this.depth = depth ? this.createDepth(width, height) : null;

    this.setupFramebuffer(this.texture, this.depth);
};

/**
 * Set this bufferQuad as render target
 */
RenderTarget.prototype.target = function() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
};

/**
 * Set up the framebuffer
 * @param {WebGLTexture} texture The color attachment
 * @param {WebGLTexture} depth The depth attachment, may be null
 */
RenderTarget.prototype.setupFramebuffer = function(texture, depth) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    if (depth !== null)
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, depth);
};

/**
 * Create the texture for this buffer
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @param {GLenum} format The texture data format
 * @param {Boolean} depth A boolean indicating whether to include a depth buffer
 * @param {GLenum} filter Texture filtering method
 * @returns {WebGLTexture} A WebGL texture
 */
RenderTarget.prototype.createTexture = function(
    width,
    height,
    format,
    depth,
    filter) {
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
        width,
        height,
        0,
        format,
        this.gl.UNSIGNED_BYTE,
        null);

    return texture;
};

/**
 * Create a depth texture
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @returns {WebGLRenderbuffer} buffer A depth buffer
 */
RenderTarget.prototype.createDepth = function(width, height) {
    const buffer = this.gl.createRenderbuffer();

    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, buffer);
    this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);

    return buffer;
};

/**
 * Receive the texture, freeing and invalidating all other sources in this render target
 * @returns {WebGLTexture} The render target texture of this render target
 */
RenderTarget.prototype.extractTexture = function() {
    this.gl.deleteFramebuffer(this.framebuffer);

    if (this.depth !== null)
        this.gl.deleteRenderbuffer(this.depth);

    return this.texture;
};

/**
 * Free all resources maintained by this bufferQuad
 */
RenderTarget.prototype.free = function() {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);

    if (this.depth !== null)
        this.gl.deleteRenderbuffer(this.depth);
};