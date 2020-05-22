/**
 * The scene foreground
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation A constellation to decorate
 * @constructor
 */
const Foreground = function(gl, constellation) {
    this.rocks = new Rocks(constellation);
    this.plants = new Plants(constellation);
};

/**
 * Free all resources maintained by the foreground
 */
Foreground.prototype.free = function() {

};