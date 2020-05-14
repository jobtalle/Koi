/**
 * A fin
 * @param {Number} at The position on the body in the range [0, 1]
 * @param {Number} radius The radius as a factor of body width
 * @constructor
 */
const Fin = function(at, radius) {
    this.at = at;
    this.radius = radius;
    this.anchor = new Vector2();
    this.anchorPrevious = this.anchor.copy();
    this.start = new Vector2();
    this.startPrevious = this.start.copy();
    this.end = new Vector2();
    this.endPrevious = new Vector2();
    this.vertebraIndex = -1;
    this.anchorRadius = 0;
    this.pattern = null;
};

Fin.prototype.ANCHOR_INSET = 1;

/**
 * Connect the fin to a spine
 * @param {Vector2[]} spine A spine
 * @param {Pattern} pattern A pattern
 * @param {Number} radius The maximum body radius
 */
Fin.prototype.connect = function(spine, pattern, radius) {
    this.vertebraIndex = Math.max(1, Math.round(spine.length * this.at));
    this.anchorRadius = this.ANCHOR_INSET * pattern.shapeBody.sample(this.vertebraIndex / (spine.length - 1)) * radius;
    this.pattern = pattern;
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
 * @param {Vector2[]} spine A spine
 * @param {Number} spacing The spacing between the vertebrae
 */
Fin.prototype.update = function(spine, spacing) {
    const r = 0.3;

    this.storePreviousState();

    this.anchor.set(spine[this.vertebraIndex]);

    const dx = (this.anchor.x - spine[this.vertebraIndex - 1].x) / spacing;
    const dy = (this.anchor.y - spine[this.vertebraIndex - 1].y) / spacing;

    this.anchor.x += dy * this.anchorRadius;
    this.anchor.y -= dx * this.anchorRadius;

    this.start.set(this.anchor);
    this.start.x += dy * r;
    this.start.y -= dx * r;

    this.end.set(this.anchor);
    this.end.x += dx * r;
    this.end.y += dy * r;
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