/**
 * A numeric manipulator that alters numeric properties
 * @constructor
 */
const NumericManipulator = function() {

};

/**
 * Get a version of a number that is an unsigned 8 bit integer
 * @param {Number} n The number to convert
 * @returns {Number} An 8 bit integer
 */
NumericManipulator.prototype.asUint8 = function(n) {
    return Math.min(0xFF, Math.max(0, Math.round(n)));
};