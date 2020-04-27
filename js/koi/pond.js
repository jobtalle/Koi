/**
 * A pond from which fish cannot escape
 * @param {Object} constraint The constraint defining this pond
 * @constructor
 */
const Pond = function(constraint) {
    this.constraint = constraint;
};

/**
 * Get the fish capacity of this pond
 * @returns {Number} The maximum number of fish that fit in this pond
 */
Pond.prototype.getCapacity = function() {
    return this.constraint.getCapacity();
};