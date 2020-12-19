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
    this.curves = this.makeCurves(nodes);

    const canvas = document.getElementById("debug");
    const context = canvas.getContext("2d");

    context.strokeStyle = "white";
    context.beginPath();
    context.save();
    context.scale(87.74, 87.74 / 1.1);

    for (const curve of this.curves) for (let point = 0, pointCount = curve.points.length - 1; point < pointCount; ++point) {
        context.moveTo(curve.points[point].x, curve.points[point].y);
        context.lineTo(curve.points[point + 1].x, curve.points[point + 1].y);
    }

    context.restore();
    context.closePath();
    context.stroke();
};

BugPath.prototype.CURVE_RESOLUTION = .05;

/**
 * Make a curve forming a continuous path through the given nodes
 * @param {BugPathNode[]} nodes The nodes
 * @returns {CubicHermiteSampler} The curve connecting the points
 */
BugPath.prototype.makeCurveContinuous = function(nodes) {
    const points = [];

    for (const node of nodes)
        points.push(node.position.vector2());

    return new CubicHermiteSampler(new CubicHermite(points), this.CURVE_RESOLUTION);
};

/**
 * Make the curves between the nodes
 * @param {BugPathNode[]} nodes The path nodes
 * @returns {CubicHermiteSampler[]} The curves connecting all nodes
 */
BugPath.prototype.makeCurves = function(nodes) {
    const curves = [];
    let lastCut = 0;

    for (let node = 0, nodeCount = nodes.length; node < nodeCount; ++node) {
        if (nodes[node] instanceof BugPathNodeSpot || node + 1 === nodeCount) {
            curves.push(this.makeCurveContinuous(nodes.slice(lastCut, node + 1)));

            lastCut = node;
        }
    }

    return curves;
};

/**
 * Move along this path
 * @param {Number} delta The amount to move
 * @returns {Boolean} True if the path has been traversed
 */
BugPath.prototype.move = function(delta) {
    this.at += delta;

    while (this.at - this.curveOffset > this.curves[this.curve].length) {
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