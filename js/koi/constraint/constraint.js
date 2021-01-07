/**
 * A constraint to keep fish in
 * @param {Number} border The border width of this constraints edges
 * @constructor
 */
const Constraint = function(border = this.BORDER) {
    this.border = border;
    this.normal = new Vector2(0, 0);
};

Constraint.prototype.BORDER = 1.25;
Constraint.prototype.MESH_RESOLUTION = .3;
Constraint.prototype.CONSTRAIN_EPSILON = .0001;
Constraint.prototype.MESH_DEPTH_PADDING = Ponds.prototype.DEPTH;