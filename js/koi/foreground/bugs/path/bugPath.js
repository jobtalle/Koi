/**
 * A flight path for a bug to follow
 * @param {BugPathNode[]} nodes The path nodes
 * @constructor
 */
const BugPath = function(nodes) {
    this.at = 0;
    this.position = new Vector2();
    this.curve = this.makeCurve(nodes);
};

BugPath.prototype.CURVE_RESOLUTION = .05;

/**
 * Make the curve between the nodes
 * @param {BugPathNode[]} nodes The path nodes
 * @returns {CubicHermiteSampler} The curve connecting all nodes
 */
BugPath.prototype.makeCurve = function(nodes) {
    this.nodes = nodes;

    const points = [];

    for (const node of nodes)
        points.push(node.position.vector2());

    return new CubicHermiteSampler(new CubicHermite(points), this.CURVE_RESOLUTION);
};

/**
 * Move along this path
 * @param {Number} delta The amount to move
 * @returns {Boolean} True if the path has been traversed
 */
BugPath.prototype.move = function(delta) {
    return (this.at += delta) > this.curve.length;
};

/**
 * Get the start coordinate
 * @returns {Vector2} The start coordinate
 */
BugPath.prototype.getStart = function() {
    return this.curve.getStart();
};

/**
 * Get the current position on the path
 * @returns {Vector2} The current position
 */
BugPath.prototype.getPosition = function() {
    this.curve.sample(this.position, this.at);

    return this.position;
};