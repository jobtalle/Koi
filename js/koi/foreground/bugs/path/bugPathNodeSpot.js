/**
 * A spot to visit on a bug path trajectory
 * @param {BugSpot} spot The spot
 * @constructor
 */
const BugPathNodeSpot = function(spot) {
    BugPathNode.call(this, spot.position);
};

BugPathNodeSpot.prototype = Object.create(BugPathNode.prototype);