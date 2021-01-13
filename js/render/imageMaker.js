/**
 * A base class for systems rendering to images
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {Number} width The render target width
 * @param {Number} height The render target height
 * @constructor
 */
const ImageMaker = function(gl, width, height) {
    this.gl = gl;
    this.target = new RenderTarget(gl, width, height, gl.RGBA, false); // TODO: Use RGB for baked backgrounds
};

/**
 * Convert the pixels in the render target to a canvas
 * @returns {HTMLCanvasElement} The canvas
 */
ImageMaker.prototype.toCanvas = function() {
    const pixels = new Uint8Array((this.target.width * this.target.height) << 2);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = this.target.width;
    canvas.height = this.target.height;

    this.gl.readPixels(0, 0, this.target.width, this.target.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);

    const imageData = context.createImageData(canvas.width, canvas.height);

    imageData.data.set(pixels);

    context.putImageData(imageData, 0, 0);

    return canvas;
};