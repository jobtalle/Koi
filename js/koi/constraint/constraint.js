/**
 * A constraint to keep fish in
 * @param {Number} border The border width of this constraints edges
 * @constructor
 */
const Constraint = function(border = this.BORDER) {
    this.border = border;
    this.normal = new Vector2(0, 0);
};

Constraint.prototype.AREA_PER_FISH = 1.3;
Constraint.prototype.BORDER = 1.1;