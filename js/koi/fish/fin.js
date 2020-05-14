/**
 * A fin
 * @param {Number} at The position on the body in the range [0, 1]
 * @param {Number} radius The radius as a factor of body width
 * @param {Boolean} side The side to which this fin is attached, true for right
 * @constructor
 */
const Fin = function(at, radius, side) {
    this.at = at;
    this.radius = radius;
    this.side = side;
    this.anchor = new Vector2();
    this.anchorPrevious = this.anchor.copy();
    this.start = new Vector2();
    this.startPrevious = this.start.copy();
    this.end = new Vector2();
    this.endPrevious = new Vector2();
    this.anchorRadius = 0;
    this.finRadius = 0;
    this.pattern = null;
};

Fin.prototype.ANCHOR_INSET = 1;

/**
 * Get the index of the vertebra this fin is connected to
 * @param {Number} spineLength The length of the spine to assign this fin to
 * @returns {Number} The vertebrae index to connect the fin to
 */
Fin.prototype.getVertebraIndex = function(spineLength) {
    return Math.max(1, Math.round(spineLength * this.at));
};

/**
 * Connect the fin to a spine
 * @param {Pattern} pattern A pattern
 * @param {Number} radius The body radius at the connection point
 */
Fin.prototype.connect = function(pattern, radius) {
    this.pattern = pattern;
    this.anchorRadius = this.ANCHOR_INSET * radius;
    this.finRadius = this.radius * radius;
};

/**
 * Instantly shift the fin position
 * @param {Number} dx The X delta
 * @param {Number} dy The Y delta
 */
Fin.prototype.shift = function(dx, dy) {
    this.anchor.x += dx;
    this.anchor.y += dy;
    this.start.x += dx;
    this.start.y += dy;
    this.end.x += dx;
    this.end.y += dy;
};

/**
 * Store the current state into the previous state
 */
Fin.prototype.storePreviousState = function() {
    this.anchorPrevious.set(this.anchor);
    this.startPrevious.set(this.start);
    this.endPrevious.set(this.end);
};

/**
 * Update the fin state
 * @param {Vector2} vertebra The connected vertebra location
 * @param {Number} dx The normalized X direction of the vertebra
 * @param {Number} dy The normalized Y direction of the vertebra
 */
Fin.prototype.update = function(vertebra, dx, dy) {
    this.storePreviousState();

    this.anchor.set(vertebra);

    if (this.side) {
        this.anchor.x += dy * this.anchorRadius;
        this.anchor.y -= dx * this.anchorRadius;

        this.start.set(this.anchor);
        this.start.x += dy * this.finRadius;
        this.start.y -= dx * this.finRadius;
    }
    else {
        this.anchor.x -= dy * this.anchorRadius;
        this.anchor.y += dx * this.anchorRadius;

        this.start.set(this.anchor);
        this.start.x -= dy * this.finRadius;
        this.start.y += dx * this.finRadius;
    }

    this.end.set(this.anchor);
    this.end.x += dx * this.finRadius;
    this.end.y += dy * this.finRadius;
};

/**
 * Render the fin
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} time The interpolation factor
 */
Fin.prototype.render = function(bodies, time) {
    const startIndex = bodies.getIndexOffset();

    const ax = this.anchorPrevious.x + (this.anchor.x - this.anchorPrevious.x) * time;
    const ay = this.anchorPrevious.y + (this.anchor.y - this.anchorPrevious.y) * time;
    const sx = this.startPrevious.x + (this.start.x - this.startPrevious.x) * time;
    const sy = this.startPrevious.y + (this.start.y - this.startPrevious.y) * time;
    const ex = this.endPrevious.x + (this.end.x - this.endPrevious.x) * time;
    const ey = this.endPrevious.y + (this.end.y - this.endPrevious.y) * time;

    bodies.vertices.push(
        ax,
        ay,
        this.pattern.region.uFinStart,
        this.pattern.region.vStart,
        sx,
        sy,
        this.pattern.region.uFinEnd,
        this.pattern.region.vStart,
        ex,
        ey,
        this.pattern.region.uFinStart,
        this.pattern.region.vEnd,
        sx + (ex - ax),
        sy + (ey - ay),
        this.pattern.region.uFinEnd,
        this.pattern.region.vEnd);
    bodies.indices.push(
        startIndex,
        startIndex + 1,
        startIndex + 2,
        startIndex + 1,
        startIndex + 2,
        startIndex + 3);
};