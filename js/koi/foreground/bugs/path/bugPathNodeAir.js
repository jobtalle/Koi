/**
 * An airborne position to fly through
 * @param {Vector3} position The position
 * @constructor
 */
const BugPathNodeAir = function(position) {
    BugPathNode.call(this, position);
};

BugPathNodeAir.prototype = Object.create(BugPathNode.prototype);