/**
 * A fish tail
 * @param {Number} length The length of the tail spine connection in the range [0, 1]
 * @constructor
 */
const Tail = function(length) {
    this.length = length;
    this.anchors = 0;
    this.top = null;
    this.topPrevious = null;
    this.bottom = null;
    this.bottomPrevious = null;
    this.distances = null;
};

Tail.prototype.DEPTH_FACTOR = .7;

/**
 * Connect the tail to a spine
 * @param {Vector2[]} spine The spine
 * @returns {Number} The index of the last unused vertebra
 */
Tail.prototype.connect = function(spine) {
    this.anchors = Math.min(spine.length - 1, Math.max(2, Math.round(spine.length * this.length)));
    this.spineOffset = spine.length - this.anchors;
    this.top = new Array(this.anchors);
    this.topPrevious = new Array(this.anchors);
    this.bottom = new Array(this.anchors);
    this.bottomPrevious = new Array(this.anchors);
    this.distances = new Array(this.anchors);

    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        this.top[vertebra] = spine[this.spineOffset + vertebra].copy();
        this.topPrevious[vertebra] = this.top[vertebra].copy();
        this.bottom[vertebra] = spine[this.spineOffset + vertebra].copy();
        this.bottomPrevious[vertebra] = this.bottom[vertebra].copy();

        this.distances[vertebra] = -.2 * Math.cos(Math.PI * .5 * (1 + (vertebra + 1) / this.anchors));
    }

    return this.spineOffset - 1;
};

/**
 * Instantly shift the tail position
 * @param {Number} dx The X delta
 * @param {Number} dy The Y delta
 */
Tail.prototype.shift = function(dx, dy) {
    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        this.top[vertebra].x += dx;
        this.top[vertebra].y += dy;
        this.topPrevious[vertebra].x += dx;
        this.topPrevious[vertebra].y += dy;
    }
};

/**
 * Store the current state into the previous state
 */
Tail.prototype.storePreviousState = function() {
    for (let i = 0; i < this.anchors; ++i) {
        this.topPrevious[i].set(this.top[i]);
        this.bottomPrevious[i].set(this.bottom[i]);
    }
};

/**
 * Update the tail
 * @param {Vector2[]} spine The spine this tail was connected to
 */
Tail.prototype.update = function(spine) {
    this.storePreviousState();

    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        const dx = this.top[vertebra].x - spine[this.spineOffset + vertebra].x;
        const dy = this.top[vertebra].y - spine[this.spineOffset + vertebra].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.top[vertebra].x = spine[this.spineOffset + vertebra].x + this.distances[vertebra] * dx / dist;
        this.top[vertebra].y = spine[this.spineOffset + vertebra].y + this.distances[vertebra] * dy / dist;
    }
};

/**
 * Get the number of vertices this tail will produce
 * @returns {Number} The number of vertices
 */
Tail.prototype.getVertexCount = function() {
    return this.anchors;
};

/**
 * Render the tail
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} firstVertebra The index of the first vertebra vertex
 * @param {Number} sign The depth direction of the tail, 1 or -1
 * @param {Number} time The interpolation factor
 * @param {Pattern} pattern A pattern
 */
Tail.prototype.render = function(bodies, firstVertebra, sign, time, pattern) {
    const u = pattern.region.uFinStart + (pattern.region.uFinEnd - pattern.region.uFinStart) * .5;
    const v = pattern.region.vStart + (pattern.region.vEnd - pattern.region.vStart) * .5;
    const startIndex = bodies.getIndexOffset();

    bodies.indices.push(
        firstVertebra - 3,
        firstVertebra,
        startIndex);

    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        const x = this.topPrevious[vertebra].x + (this.top[vertebra].x - this.topPrevious[vertebra].x) * time;
        const y = this.topPrevious[vertebra].y + (this.top[vertebra].y - this.topPrevious[vertebra].y) * time;

        bodies.vertices.push(
            x,
            y + sign * this.distances[vertebra] * this.DEPTH_FACTOR,
            u,
            v);

        if (vertebra < this.anchors - 1)
            bodies.indices.push(
                firstVertebra + 3 * (vertebra + 1),
                firstVertebra + 3 * vertebra,
                startIndex + vertebra,
                startIndex + vertebra,
                startIndex + vertebra + 1,
                firstVertebra + 3 * (vertebra + 1));
    }
};