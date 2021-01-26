/**
 * A flight path for a bug to follow
 * @param {BugPathNode[]} nodes The path nodes
 * @constructor
 */
const BugPath = function(nodes) {
    this.nodes = nodes;
    this.at = 0;
    this.position = new Vector3();
    this.path = this.makePath();
};

BugPath.prototype.INITIAL_POSITION = new SamplerPower(0, 1, .2);

/**
 * Set the position on this path to a random position
 * @param {Random} random A randomizer
 */
BugPath.prototype.setRandomPosition = function(random) {
    this.at = this.path.getLength() * this.INITIAL_POSITION.sample(random.getFloat());
};

/**
 * Make the path between the nodes
 * @returns {Path3Sampler} The curve connecting all nodes
 */
BugPath.prototype.makePath = function() {
    const points = [];

    for (const node of this.nodes)
        points.push(node.position);

    return new Path3Sampler(new Path3CubicHermite(points));
};

/**
 * Move along this path
 * @param {Number} delta The amount to move
 * @returns {Boolean} True if the path has been traversed
 */
BugPath.prototype.move = function(delta) {
    return (this.at += delta) > this.path.getLength();
};

/**
 * Get the start coordinate
 * @returns {Vector2} The start coordinate
 */
BugPath.prototype.getStart = function() {
    return this.path.getPath().getStart();
};

/**
 * Get the last node
 * @returns {BugPathNode} The last node
 */
BugPath.prototype.getLastNode = function() {
    return this.nodes[this.nodes.length - 1];
};

/**
 * Store the bug path position in a vector
 * @param {Vector3} vector The vector to store the current position in
 * @param {Number} [delta] The delta from the current position, zero by default
 */
BugPath.prototype.sample = function(vector, delta = 0) {
    this.path.sample(vector, Math.min(this.path.getLength(), this.at + delta));
};

/**
 * Get the length of this bug path
 * @returns {Number} The length of the bug path
 */
BugPath.prototype.length = function() {
    return this.path.getLength();
};