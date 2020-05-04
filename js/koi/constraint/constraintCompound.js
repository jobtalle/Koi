/**
 * A compound constraint
 * @param {Object} a The first constraint
 * @param {Object} b The second constraint
 * @param {Divisor} divisor A divisor between the two constraints
 * @constructor
 */
const ConstraintCompound = function(a, b, divisor) {
    this.a = a;
    this.b = b;
    this.normal = new Vector2();
};

/**
 * Get the fish capacity of this constraint
 * @returns {Number} The maximum number of fish that fit within this constraint
 */
ConstraintCompound.prototype.getCapacity = function() {
    // TODO: How to get the split fraction of each constraint?

    return (this.a.getCapacity() + this.b.getCapacity()) * .5;
};

/**
 * Sample the distance to the nearest edge of this constraint
 * @param {Vector2} position The position to sample
 * @returns {Number} The proximity in the range [0, 1]
 */
ConstraintCompound.prototype.sample = function(position) {

};

/**
 * Draw the circle
 * @param {Renderer} renderer The renderer
 */
ConstraintCompound.prototype.render = function(renderer) {
    this.a.render(renderer);
    this.b.render(renderer);
};