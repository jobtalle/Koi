/**
 * A still fish preview
 * @param {WebGLRenderingContext} gl A WebGL context
 * @constructor
 */
const Still = function(gl) {
    ImageMaker.call(this, gl, this.RADIUS << 1, this.RADIUS << 1);
};

Still.prototype = Object.create(ImageMaker.prototype);
Still.prototype.RADIUS = 128;
Still.prototype.SCALE = 200;

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

    this.gl.clearColor(1, 1, 1, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    body.renderLoop(this.RADIUS, this.RADIUS << 1, this.RADIUS, 0, bodies, 0);
    bodies.render(atlas, widthMeters, -heightMeters, false);
};

/**
 * Free all data maintained by the still renderer
 */
Still.prototype.free = function() {
    this.target.free();
};