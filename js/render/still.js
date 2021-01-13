/**
 * A still fish preview
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Still = function(gl) {
    ImageMaker.call(this, gl, (this.RADIUS << 1) * this.UPSCALE, (this.RADIUS << 1) * this.UPSCALE);
};

Still.prototype = Object.create(ImageMaker.prototype);
Still.prototype.RADIUS = 128;
Still.prototype.UPSCALE = 1.5;
Still.prototype.SCALE = 220 * Still.prototype.UPSCALE;
Still.prototype.ANGLE = 0;

/**
 * Render a fish still
 * @param {FishBody} body The fish body to render
 * @param {Atlas} atlas The atlas
 * @param {Bodies} bodies The bodies renderer
 * @returns {HTMLCanvasElement} The canvas containing the still
 */
Still.prototype.render = function(body, atlas, bodies) {
    const widthMeters = this.target.width / this.SCALE;
    const heightMeters = this.target.height / this.SCALE;

    this.target.target();

    this.gl.clearColor(.1, .1, .1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    body.renderLoop(
        (this.RADIUS + Math.cos(this.ANGLE) * this.RADIUS) * this.UPSCALE / this.SCALE,
        (this.RADIUS + Math.sin(this.ANGLE) * this.RADIUS) * this.UPSCALE / this.SCALE,
        (this.RADIUS - Math.cos(this.ANGLE) * this.RADIUS) * this.UPSCALE / this.SCALE,
        (this.RADIUS - Math.sin(this.ANGLE) * this.RADIUS) * this.UPSCALE / this.SCALE,
        bodies,
        body.hash() / 0xFF);
    bodies.render(atlas, widthMeters, -heightMeters, false);

    return this.toCanvas();
};

/**
 * Free all data maintained by the still renderer
 */
Still.prototype.free = function() {
    this.target.free();
};