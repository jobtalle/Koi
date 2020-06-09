/**
 * A relative position in an arc path constraint
 * @param {Number} index The arc index, with 0 being the spawn arc
 * @param {Number} radius The radius inside the arc ring
 * @param {Number} progress The arc progress in the range [0, 1]
 * @constructor
 */
const ConstraintArcPathPosition = function(index, radius, progress) {
    this.index = index;
    this.radius = radius;
    this.progress = progress;
};