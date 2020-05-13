/**
 * A water plane to render waves on
 * @param {WebGLRenderingContext} gl A WebGL render context
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 * @constructor
 */
const WaterPlane = function(gl, width, height) {
    // TODO: The B channel is not used right now
    this.front = 0;
    this.width = Math.ceil(width * this.SCALE);
    this.height = Math.ceil(height * this.SCALE);
    this.flares = [];
    this.targets = [
        new RenderTarget(gl, this.width, this.height, gl.RGB, gl.LINEAR, gl.FLOAT),
        new RenderTarget(gl, this.width, this.height, gl.RGB, gl.LINEAR, gl.FLOAT)
    ];
};

WaterPlane.prototype.SCALE = 16;

/**
 * Add a flare of wave height to the water plane
 * @param {Number} x The X position of the flare
 * @param {Number} y The Y position of the flare
 * @param {Number} radius The flare radius
 * @param {Number} displacement The amount of displacement
 */
WaterPlane.prototype.addFlare = function(x, y, radius, displacement) {
    this.flares.push(x, y, radius, displacement);
};

/**
 * Flip the buffers after propagating
 */
WaterPlane.prototype.flip = function() {
    this.front = 1 - this.front;
};

/**
 * Return the render target currently used as the front bufferQuad
 * @returns {RenderTarget} The current front bufferQuad
 */
WaterPlane.prototype.getFront = function() {
    return this.targets[this.front];
};

/**
 * Return the render target currently used as the back bufferQuad
 * @returns {RenderTarget} The current back bufferQuad
 */
WaterPlane.prototype.getBack = function() {
    return this.targets[1 - this.front];
};

/**
 * Free all resources maintained by this water plane
 */
WaterPlane.prototype.free = function() {
    for (const target of this.targets)
        target.free();
};