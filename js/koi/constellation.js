/**
 * A pond constellation consisting of a large pond, a small pond, and space for a river between
 * @param {Number} width The scene width in meters
 * @param {Number} height The scene height in meters
 * @constructor
 */
const Constellation = function(width, height) {
    this.angle = 0;
    this.width = width;
    this.height = height;
    this.big = null;
    this.small = null;
    this.river = null;

    this.fit();
};

/**
 * Resize the constellation
 * @param {Number} width The scene width
 * @param {Number} height The scene height
 */
Constellation.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.fit();
};

/**
 * Calculate the constellation layout
 */
Constellation.prototype.fit = function() {

};