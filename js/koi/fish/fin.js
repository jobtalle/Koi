/**
 * A fin
 * @param {Number} at The position on the body in the range [0, 255]
 * @param {Number} radius The radius in the range [0, 255]
 * @param {Number} [sign] The sign of the fin direction, 1 (default) or -1
 * @constructor
 */
const Fin = function(at, radius, sign = 1) {
    this.at = at;
    this.radius = radius;
    this.sign = sign;
    this.anchor = new Vector2();
    this.anchorPrevious = this.anchor.copy();
    this.start = new Vector2();
    this.startPrevious = this.start.copy();
    this.end = new Vector2();
    this.endPrevious = new Vector2();
    this.anchorRadius = 0;
    this.finRadius = 0;
    this.finDepth = 0;
    this.pattern = null;
};

Fin.prototype.ANCHOR_INSET = .95;
Fin.prototype.SKEW = .1;
Fin.prototype.WAVE_SKEW = .2;
Fin.prototype.X_SCALE = .6;
Fin.prototype.SPRING = .4;
Fin.prototype.PHASE_SHIFT = 2;
Fin.prototype.DEPTH_FACTOR = .4;
Fin.prototype.SAMPLER_RADIUS = new Sampler(.5, 2.2);

/**
 * Deserialize a fin
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Fin.deserialize = function(buffer) {
    return new Fin(buffer.readUint8(), buffer.readUint8());
};

/**
 * Serialize this fin
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Fin.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.at);
    buffer.writeUint8(this.radius);
};

/**
 * Make a mirrored copy of this fin
 * @returns {Fin} The copy
 */
Fin.prototype.copyMirrored = function() {
    return new Fin(this.at, this.radius, -this.sign);
};

/**
 * Get the index of the vertebra this fin is connected to
 * @param {Number} spineLength The length of the spine to assign this fin to
 * @returns {Number} The vertebrae index to connect the fin to
 */
Fin.prototype.getVertebraIndex = function(spineLength) {
    return Math.max(1, Math.round(spineLength * this.at / 0xFF));
};

/**
 * Connect the fin to a spine
 * @param {Pattern} pattern A pattern
 * @param {Number} radius The body radius at the connection point
 */
Fin.prototype.connect = function(pattern, radius) {
    this.pattern = pattern;
    this.anchorRadius = this.ANCHOR_INSET * radius;
    this.finRadius = this.SAMPLER_RADIUS.sample(this.radius / 0xFF) * radius;
};

/**
 * Initialize the fin position
 * @param {Vector2} position The initial position
 */
Fin.prototype.initializePosition = function(position) {
    this.anchor.set(position);
    this.start.set(position);
    this.end.set(position);
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

    this.storePreviousState();
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
 * Set a neutral position for this fin
 * @param {Vector2} vertebra The connected vertebra location
 * @param {Number} dx The normalized X direction of the vertebra
 * @param {Number} dy The normalized Y direction of the vertebra
 * @param {Number} phase The fin phase
 * @param {Number} phaseAmplitude The phase amplitude multiplier
 * @param {Number} size The fin size in the range [0, 1]
 */
Fin.prototype.setNeutral = function(
    vertebra,
    dx,
    dy,
    phase,
    phaseAmplitude,
    size) {
    this.update(vertebra, dx, dy, phase, size, 1, phaseAmplitude);
};

/**
 * Update the fin state
 * @param {Vector2} vertebra The connected vertebra location
 * @param {Number} dx The normalized X direction of the vertebra
 * @param {Number} dy The normalized Y direction of the vertebra
 * @param {Number} phase The fin phase
 * @param {Number} size The fin size in the range [0, 1]
 * @param {Number} [spring] The spring strength
 * @param {Number} [phaseAmplitude] The phase amplitude multiplier
 */
Fin.prototype.update = function(
    vertebra,
    dx,
    dy,
    phase,
    size,
    spring = this.SPRING,
    phaseAmplitude = 1) {
    this.storePreviousState();

    this.finDepth = this.finRadius * this.DEPTH_FACTOR * size;

    const radius = this.finRadius * size;
    const dxSide = this.sign * dy * size;
    const dySide = this.sign * -dx * size;
    let dxStart = dxSide * radius * this.X_SCALE;
    let dyStart = dySide * radius * this.X_SCALE;

    this.anchor.x = vertebra.x + dxSide * this.anchorRadius;
    this.anchor.y = vertebra.y + dySide * this.anchorRadius;

    const skew = Math.sin(phase + this.at * this.PHASE_SHIFT) * this.WAVE_SKEW * phaseAmplitude + this.SKEW;

    this.start.x += (this.anchor.x + dxStart + radius * dx * skew - this.start.x) * spring;
    this.start.y += (this.anchor.y + dyStart + radius * dy * skew - this.start.y) * spring;

    this.end.x = this.anchor.x + radius * dx;
    this.end.y = this.anchor.y + radius * dy;
};

/**
 * Render the fin
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} time The interpolation factor
 */
Fin.prototype.render = function(bodies, time) {
    const startIndex = bodies.buffer.getVertexCount();

    const ax = this.anchorPrevious.x + (this.anchor.x - this.anchorPrevious.x) * time;
    const ay = this.anchorPrevious.y + (this.anchor.y - this.anchorPrevious.y) * time;
    const sx = this.startPrevious.x + (this.start.x - this.startPrevious.x) * time;
    const sy = this.startPrevious.y + (this.start.y - this.startPrevious.y) * time;
    const ex = this.endPrevious.x + (this.end.x - this.endPrevious.x) * time;
    const ey = this.endPrevious.y + (this.end.y - this.endPrevious.y) * time;

    bodies.buffer.addVertices(
        ax,
        ay,
        this.pattern.region.uFinStart,
        this.pattern.region.vStart,
        sx,
        sy + this.finDepth,
        this.pattern.region.uFinEnd,
        this.pattern.region.vStart,
        ex,
        ey,
        this.pattern.region.uFinStart,
        this.pattern.region.vEnd,
        sx + (ex - ax),
        sy + (ey - ay) + this.finDepth,
        this.pattern.region.uFinEnd,
        this.pattern.region.vEnd);
    bodies.buffer.addIndices(
        startIndex,
        startIndex + 1,
        startIndex + 2,
        startIndex + 1,
        startIndex + 2,
        startIndex + 3);
};