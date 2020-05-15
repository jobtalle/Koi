/**
 * A fin
 * @param {Number} at The position on the body in the range [0, 1]
 * @param {Number} radius The radius as a factor of body width
 * @param {Number} sign The sign of the fin direction, 1 or -1
 * @constructor
 */
const Fin = function(at, radius, sign) {
    this.at = at;
    this.radius = radius;
    this.sign = sign;
    this.phase = 0;
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
Fin.prototype.FIN_SKEW_BASE = .2;
Fin.prototype.FIN_SKEW_WAVE = .2;
Fin.prototype.FIN_WAVE_SPEED = .4;
Fin.prototype.FIN_X_SCALE = .6;
Fin.prototype.FIN_SPRING = .4;

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

    if ((this.phase -= this.FIN_WAVE_SPEED) < 0)
        this.phase += Math.PI + Math.PI;

    const dxSide = this.sign * dy;
    const dySide = this.sign * -dx;
    let dxStart = dxSide * this.finRadius * this.FIN_X_SCALE;
    let dyStart = dySide * this.finRadius * this.FIN_X_SCALE;

    this.anchor.x = vertebra.x + dxSide * this.anchorRadius;
    this.anchor.y = vertebra.y + dySide * this.anchorRadius;

    const skew = Math.sin(this.phase + this.at) * this.FIN_SKEW_WAVE + this.FIN_SKEW_BASE;

    this.start.x += (this.anchor.x + dxStart + this.finRadius * dx * skew - this.start.x) * this.FIN_SPRING;
    this.start.y += (this.anchor.y + dyStart + this.finRadius * dy * skew - this.start.y) * this.FIN_SPRING;

    this.end.x = this.anchor.x + this.finRadius * dx;
    this.end.y = this.anchor.y + this.finRadius * dy;
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