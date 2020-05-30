/**
 * A water plane to render waves on
 * @param {WebGLRenderingContext} gl A WebGL render context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const Water = function(gl, width, height) {
    this.front = 0;
    this.width = Math.ceil(width * this.SCALE);
    this.height = Math.ceil(height * this.SCALE);
    this.flares = [];
    this.hasInfluences = false;
    this.targets = [
        new RenderTarget(gl, this.width, this.height, gl.RGB, false),
        new RenderTarget(gl, this.width, this.height, gl.RGB, false)];

    gl.clearColor(.5, .5, 0, 0);

    for (const target of this.targets) {
        target.target();

        gl.clear(gl.COLOR_BUFFER_BIT);
    }
};

Water.prototype.SCALE = 18;

/**
 * Add a flare of wave height to the water plane
 * @param {Number} x The X position of the flare
 * @param {Number} y The Y position of the flare
 * @param {Number} radius The flare radius
 * @param {Number} displacement The amount of displacement in the range [0, 1]
 */
Water.prototype.addFlare = function(x, y, radius, displacement) {
    this.flares.push(x, y, radius, displacement);
    this.hasInfluences = true;
};

/**
 * Flip the buffers after propagating
 */
Water.prototype.flip = function() {
    this.front = 1 - this.front;
};

/**
 * Return the render target currently used as the front buffer
 * @returns {RenderTarget} The current front buffer
 */
Water.prototype.getFront = function() {
    return this.targets[this.front];
};

/**
 * Return the render target currently used as the back buffer
 * @returns {RenderTarget} The current back buffer
 */
Water.prototype.getBack = function() {
    return this.targets[1 - this.front];
};

/**
 * Free all resources maintained by this water plane
 */
Water.prototype.free = function() {
    for (const target of this.targets)
        target.free();
};