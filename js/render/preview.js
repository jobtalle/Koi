/**
 * A fish preview animation maker
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Preview = function(gl) {
    this.gl = gl;
    this.target = new RenderTarget(
        gl,
        this.PREVIEW_WIDTH * this.PREVIEW_COLUMNS,
        this.PREVIEW_HEIGHT * this.PREVIEW_ROWS,
        gl.RGBA,
        false);
};

Preview.prototype.PREVIEW_WIDTH = StyleUtils.getInt("--card-preview-width");
Preview.prototype.PREVIEW_HEIGHT = StyleUtils.getInt("--card-preview-height");
Preview.prototype.PREVIEW_COLUMNS = StyleUtils.getInt("--card-preview-columns");
Preview.prototype.PREVIEW_ROWS = StyleUtils.getInt("--card-preview-rows");
Preview.prototype.SCALE = 150;

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
 * @param {RandomSource} [randomSource] A random source, if the pattern region can be null
 * @returns {HTMLCanvasElement} The canvas containing the preview
 */
Preview.prototype.render = function(body, atlas, bodies, randomSource = null) {
    const widthMeters = this.target.width / this.SCALE;
    const heightMeters = this.target.height / this.SCALE;
    const frames = this.PREVIEW_COLUMNS * this.PREVIEW_ROWS;

    if (!body.pattern.region)
        atlas.write(body.pattern, randomSource);

    this.target.target();

    this.gl.clearColor(1, 1, 1, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.SCISSOR_TEST);

    for (let row = 0; row < this.PREVIEW_ROWS; ++row) for (let column = 0; column < this.PREVIEW_COLUMNS; ++column) {
        const left = column * this.PREVIEW_WIDTH;
        const top = (this.PREVIEW_ROWS - row) * this.PREVIEW_HEIGHT;
        const right = (column + 1) * this.PREVIEW_WIDTH;
        const bottom = (this.PREVIEW_ROWS - row - 1) * this.PREVIEW_HEIGHT;

        this.gl.scissor(left, row * this.PREVIEW_HEIGHT, this.PREVIEW_WIDTH, this.PREVIEW_HEIGHT);

        body.renderLoop(
            right / this.SCALE,
            top / this.SCALE,
            left / this.SCALE,
            bottom / this.SCALE,
            bodies,
            (row * this.PREVIEW_COLUMNS + column) / frames);

        bodies.render(atlas, widthMeters, -heightMeters, false);
    }

    this.gl.disable(this.gl.SCISSOR_TEST);

    return this.createCanvas();
};

/**
 * Free all data maintained by the preview renderer
 */
Preview.prototype.free = function() {
    this.target.free();
};