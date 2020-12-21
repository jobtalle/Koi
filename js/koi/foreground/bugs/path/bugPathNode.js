/**
 * A node on a bug path
 * @param {Vector3} position The node position
 * @param {BugSpot} [spot] The target bug spot, if this path leads to one
 * @constructor
 */
const BugPathNode = function(position, spot = null) {
    this.position = position;
    this.spot = spot;
};

/**
 * Get the priority score for this node
 * @param {Biome} biome The biome
 * @returns {Number} The priority, higher is more preferable
 */
BugPathNode.prototype.getPriority = function(biome) {
    return biome.sampleSDF(this.position.x, this.position.y);
};