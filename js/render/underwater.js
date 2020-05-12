/**
 * A buffer that contains all underwater scenery
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number} width The width in pixels
 * @param {Number} height The height in pixels
 * @constructor
 */
const Underwater = function(gl, width, height) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.framebuffer = gl.createFramebuffer();
    this.texture = this.createTexture();
};

/**
 * Set this buffer as render target
 */
Underwater.prototype.target = function() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.viewport(0, 0, this.width, this.height);
};

/**
 * Create the texture for this underwater buffer
 * @returns {WebGLTexture} A WebGL texture
 */
Underwater.prototype.createTexture = function() {
    const texture = this.gl.createTexture();

    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGB,
        this.width,
        this.height,
        0,
        this.gl.RGB,
        this.gl.UNSIGNED_BYTE,
        null);

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    return texture;
};

/**
 * Free all resources maintained by this buffer
 */
Underwater.prototype.free = function() {
    this.gl.deleteFramebuffer(this.framebuffer);
    this.gl.deleteTexture(this.texture);
};