/**
 * A flight path for a bug to follow
 * @param {BugPathNode[]} nodes The path nodes
 * @constructor
 */
const BugPath = function(nodes) {
    this.nodes = nodes; // TODO: Make path from nodes
    this.at = 0;
    this.position = new Vector2();
    this.curveOffset = 0;
    this.curve = 0;
    this.curves = [
        new BezierLinear(
            new Bezier(
                new Vector2(2, 2),
                new Vector2(12, 12),
                new Vector2(12, 2)),
            .05)
    ];
};

/**
 * Move along this path
 * @param {Number} delta The amount to move
 * @returns {Boolean} True if the path has been traversed
 */
BugPath.prototype.move = function(delta) {
    if ((this.at += delta) - this.curveOffset > this.curves[this.curve].length) {
        this.curveOffset += this.curves[this.curve++].length;

        if (this.curve === this.curves.length)
            return true;
    }

    return false;
};

/**
 * Get the start coordinate
 * @returns {Vector2} The start coordinate
 */
BugPath.prototype.getStart = function() {
    return this.curves[0].getStart();
};

/**
 * Get the current position on the path
 * @returns {Vector2} The current position
 */
BugPath.prototype.getPosition = function() {
    this.curves[this.curve].sample(this.position, this.at - this.curveOffset);

    return this.position;
};