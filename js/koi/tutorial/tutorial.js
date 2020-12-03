/**
 * The tutorial base class
 * @param {Overlay} overlay The overlay object to show hints on
 * @constructor
 */
const Tutorial = function(overlay) {
    this.phase = 0;
    this.overlay = overlay;
};

/**
 * Advance the tutorial phase
 */
Tutorial.prototype.advance = function() {
    ++this.phase;
};

/**
 * Update the tutorial state
 * @param {Constellation} constellation The constellation
 * @param {Mover} mover The mover
 * @returns {Boolean} True if the tutorial has finished
 */
Tutorial.prototype.update = function(constellation, mover) {
    return true;
};

/**
 * Render the tutorial
 * @param {Constellation} constellation The constellation
 * @param {Number} scale The scale
 * @param {Number} time The amount of time since the last update
 */
Tutorial.prototype.render = function(constellation, scale, time) {

};

/**
 * A function that is called after breeding took place
 * @param {Constellation} constellation The constellation
 * @param {Pond} pond The pond where the breeding took place
 */
Tutorial.prototype.onBreed = function(constellation, pond) {

};