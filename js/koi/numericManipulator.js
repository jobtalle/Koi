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
NumericManipulator.prototype.clampUint8 = function(n) {
    return Math.min(0xFF, Math.max(0, Math.round(n)));
};

/**
 * Clamp the values of a 3D vector between minimum and maximum values
 * @param {Vector3} vector The vector to clamp
 * @param {Number} min The minimum value
 * @param {Number} max The maximum value
 */
NumericManipulator.prototype.clampVector3 = function(vector, min, max) {
    if (vector.x < min)
        vector.x = min;
    else if (vector.x > max)
        vector.x = max;

    if (vector.y < min)
        vector.y = min;
    else if (vector.y > max)
        vector.y = max;

    if (vector.z < min)
        vector.z = min;
    else if (vector.z > max)
        vector.z = max;
};