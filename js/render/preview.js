/**
 * A fish preview animation maker
 * @param {WebGLRenderingContext} gl A WebGL context
 * @param {FishBackground} fishBackground A fish background renderer
 * @constructor
 */
const Preview = function(gl, fishBackground) {
    ImageMaker.call(this, gl, this.PREVIEW_WIDTH * this.PREVIEW_COLUMNS, this.PREVIEW_HEIGHT * this.PREVIEW_ROWS);

    this.fishBackground = fishBackground;
};

Preview.prototype = Object.create(ImageMaker.prototype);
Preview.prototype.PREVIEW_SCALE = StyleUtils.getFloat("--card-scale");
Preview.prototype.PREVIEW_WIDTH = StyleUtils.getInt("--card-preview-width-default") * Preview.prototype.PREVIEW_SCALE;
Preview.prototype.PREVIEW_HEIGHT = StyleUtils.getInt("--card-preview-height-default") * Preview.prototype.PREVIEW_SCALE;
Preview.prototype.PREVIEW_COLUMNS = StyleUtils.getInt("--card-preview-columns");
Preview.prototype.PREVIEW_ROWS = StyleUtils.getInt("--card-preview-rows");
Preview.prototype.SCALE = 150;

/**
 * Render a fish preview to a canvas
 * @param {FishBody} body The fish body to render
 * @param {Atlas} atlas The atlas
 * @param {Bodies} bodies The bodies renderer
 * @returns {HTMLCanvasElement} The canvas containing the preview
 */
Preview.prototype.render = function(body, atlas, bodies) {
    const phaseShift = body.hash() / 0xFF;
    const widthMeters = this.target.width / this.SCALE;
    const heightMeters = this.target.height / this.SCALE;
    const frames = this.PREVIEW_COLUMNS * this.PREVIEW_ROWS;

    this.target.target();
    this.gl.enable(this.gl.SCISSOR_TEST);

    this.gl.blendFuncSeparate(
            this.gl.SRC_ALPHA,
            this.gl.ONE_MINUS_SRC_ALPHA,
            this.gl.ONE_MINUS_DST_ALPHA,
            this.gl.ONE);

    for (let row = 0; row < this.PREVIEW_ROWS; ++row) for (let column = 0; column < this.PREVIEW_COLUMNS; ++column) {
        const left = column * this.PREVIEW_WIDTH;
        const top = (this.PREVIEW_ROWS - row) * this.PREVIEW_HEIGHT;
        const right = (column + 1) * this.PREVIEW_WIDTH;
        const bottom = (this.PREVIEW_ROWS - row - 1) * this.PREVIEW_HEIGHT;

        this.gl.scissor(left, row * this.PREVIEW_HEIGHT, this.PREVIEW_WIDTH, this.PREVIEW_HEIGHT);

        this.fishBackground.render(
            widthMeters / this.PREVIEW_COLUMNS,
            heightMeters / this.PREVIEW_COLUMNS,
            column / this.PREVIEW_COLUMNS,
            row / this.PREVIEW_ROWS,
            (column + 1) / this.PREVIEW_COLUMNS,
            (row + 1) / this.PREVIEW_ROWS);

        body.renderLoop(
            right / this.SCALE,
            top / this.SCALE,
            left / this.SCALE,
            bottom / this.SCALE,
            bodies,
            (phaseShift + (row * this.PREVIEW_COLUMNS + column) / frames) % 1);

        bodies.render(atlas, widthMeters, -heightMeters, false);
    }

    this.gl.blendFunc(
            this.gl.SRC_ALPHA,
            this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.disable(this.gl.SCISSOR_TEST);

    return this.toCanvas();
};

/**
 * Free all data maintained by the preview renderer
 */
Preview.prototype.free = function() {
    this.target.free();
};