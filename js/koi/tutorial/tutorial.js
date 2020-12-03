/**
 * The tutorial base class
 * @constructor
 */
const Tutorial = function() {
    this.phase = 0;
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