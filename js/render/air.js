/**
 * An air plane to render wind on
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const Air = function(gl, width, height) {
    // TODO: Create prototype that fits both air and wind
    this.front = 0;
    this.width = Math.ceil(width * this.SCALE);
    this.height = Math.ceil(height * this.SCALE);
    this.influences = new InfluencePainter.Influences(this.width, this.height, this.SCALE);
    this.targets = [
        new RenderTarget(gl, this.width, this.height, gl.RGB, false),
        new RenderTarget(gl, this.width, this.height, gl.RGB, false)];

    gl.clearColor(.5, 0, 0, 1);

    for (const target of this.targets) {
        target.target();

        gl.clear(gl.COLOR_BUFFER_BIT);
    }
};

Air.prototype.SCALE = 4;

/**
 * Add displacement to the air
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Number} radius The displacement radius
 * @param {Number} amount The amount of displacement in the range [-1, 1]
 */
Air.prototype.addDisplacement = function(x, y, radius, amount) {
    if (amount > 0)
        this.influences.addFlare(x, y, radius, 0, 0, amount);
    else
        this.influences.addFlare(x, y, radius, 0, -amount, 0);
};

/**
 * Flip the buffers after propagating
 */
Air.prototype.flip = function() {
    this.front = 1 - this.front;
};

/**
 * Return the render target currently used as the front buffer
 * @returns {RenderTarget} The current front buffer
 */
Air.prototype.getFront = function() {
    return this.targets[this.front];
};

/**
 * Return the render target currently used as the back buffer
 * @returns {RenderTarget} The current back buffer
 */
Air.prototype.getBack = function() {
    return this.targets[1 - this.front];
};

/**
 * Free all resources maintained by this air buffer
 */
Air.prototype.free = function() {
    for (const target of this.targets)
        target.free();
};