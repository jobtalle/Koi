/**
 * A fish preview animation maker
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Preview = function(gl) {
    this.gl = gl;
    this.target = new RenderTarget(gl, this.PREVIEW_WIDTH, this.PREVIEW_HEIGHT, gl.RGBA, false);
};

Preview.prototype.PREVIEW_WIDTH = StyleUtils.getInt("--card-preview-width");
Preview.prototype.PREVIEW_HEIGHT = StyleUtils.getInt("--card-preview-height");

/**
 * Create a canvas from the render target
 * @returns {HTMLCanvasElement} The canvas
 */
Preview.prototype.createCanvas = function() {
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

/**
 * Render a fish preview to a canvas
 * @param {FishBody} body The fish body to render
 * @param {Atlas} atlas The atlas
 * @param {Bodies} bodies The bodies renderer
 * @returns {HTMLCanvasElement} The canvas containing the preview
 */
Preview.prototype.render = function(body, atlas, bodies) {
    this.target.target();

    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    return this.createCanvas();
};

/**
 * Free all data maintained by the preview renderer
 */
Preview.prototype.free = function() {
    this.target.free();
};