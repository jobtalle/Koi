/**
 * A constraint to keep fish in
 * @param {Number} border The border width of this constraints edges
 * @constructor
 */
const Constraint = function(border) {
    this.border = border;
    this.normal = new Vector(0, 0);
};