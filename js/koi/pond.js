/**
 * A pond from which fish cannot escape
 * @param {Object} constraint The constraint defining this pond
 * @constructor
 */
const Pond = function(constraint) {
    this.constraint = constraint;
};