/**
 * A fish tail
 * @param {Number} length The length of the tail spine connection in the range [0, 1]
 * @constructor
 */
const Tail = function(length) {
    this.length = length;
    this.anchors = 0;
    this.edge = null;
    this.edgePrevious = null;
    this.distances = null;
};

Tail.prototype.DEPTH = .15;
Tail.prototype.SPRING = .55;
Tail.prototype.SHIFT = .8;

/**
 * Connect the tail to a spine
 * @param {Vector2[]} spine The spine
 * @returns {Number} The index of the last unused vertebra
 */
Tail.prototype.connect = function(spine) {
    this.anchors = Math.min(spine.length - 1, Math.max(2, Math.round(spine.length * this.length)));
    this.spineOffset = spine.length - this.anchors;
    this.edge = new Array(this.anchors);
    this.edgePrevious = new Array(this.anchors);
    this.distances = new Array(this.anchors);

    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        this.edge[vertebra] = spine[this.spineOffset + vertebra].copy();
        this.edgePrevious[vertebra] = this.edge[vertebra].copy();

        this.distances[vertebra] = -this.DEPTH * Math.cos(Math.PI * .5 * (1 + (vertebra + 1) / this.anchors));
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
        this.edge[vertebra].x += dx;
        this.edge[vertebra].y += dy;
        this.edgePrevious[vertebra].x += dx;
        this.edgePrevious[vertebra].y += dy;
    }
};

/**
 * Store the current state into the previous state
 */
Tail.prototype.storePreviousState = function() {
    for (let i = 0; i < this.anchors; ++i)
        this.edgePrevious[i].set(this.edge[i]);
};

/**
 * Update the tail
 * @param {Vector2[]} spine The spine this tail was connected to
 */
Tail.prototype.update = function(spine) {
    this.storePreviousState();

    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        const sx = spine[this.spineOffset + vertebra].x - spine[this.spineOffset + vertebra - 1].x;
        const sy = spine[this.spineOffset + vertebra].y - spine[this.spineOffset + vertebra - 1].y;

        const dx = spine[this.spineOffset + vertebra].x + sx * this.SHIFT - this.edge[vertebra].x;
        const dy = spine[this.spineOffset + vertebra].y + sy * this.SHIFT - this.edge[vertebra].y;

        this.edge[vertebra].x += dx * this.SPRING;
        this.edge[vertebra].y += dy * this.SPRING;
    }
};

/**
 * Get the number of vertices this tail will produce
 * @returns {Number} The number of vertices
 */
Tail.prototype.getVertexCount = function() {
    return this.anchors << 1;
};

/**
 * Render the bottom part of the tail
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} startIndex The index of the first fin vertex
 * @param {Number} firstVertebra The index of the first vertebra vertex
 * @param {Number} time The interpolation factor
 * @param {Pattern} pattern A pattern
 */
Tail.prototype.renderBottom = function(
    bodies,
    startIndex,
    firstVertebra,
    time,
    pattern) {
    const u = pattern.region.uFinStart + (pattern.region.uFinEnd - pattern.region.uFinStart) * .5;
    const v = pattern.region.vStart + (pattern.region.vEnd - pattern.region.vStart) * .5;

    bodies.buffer.addIndices(
        firstVertebra,
        firstVertebra + 3,
        startIndex);

    for (let vertebra = 0; vertebra < this.anchors; ++vertebra) {
        const x = this.edgePrevious[vertebra].x + (this.edge[vertebra].x - this.edgePrevious[vertebra].x) * time;
        const y = this.edgePrevious[vertebra].y + (this.edge[vertebra].y - this.edgePrevious[vertebra].y) * time;

        bodies.buffer.addVertices(
            x,
            y + this.distances[vertebra],
            u,
            v,
            x,
            y - this.distances[vertebra],
            u,
            v);

        if (vertebra !== this.anchors - 1)
            if (vertebra === this.anchors - 2)
                bodies.buffer.addIndices(
                    firstVertebra + 3 * (vertebra + 2) - 1,
                    firstVertebra + 3 * (vertebra + 1),
                    startIndex + (vertebra << 1),
                    startIndex + (vertebra << 1),
                    startIndex + ((vertebra + 1) << 1),
                    firstVertebra + 3 * (vertebra + 2) - 1);
            else
                bodies.buffer.addIndices(
                    firstVertebra + 3 * (vertebra + 2),
                    firstVertebra + 3 * (vertebra + 1),
                    startIndex + (vertebra << 1),
                    startIndex + (vertebra << 1),
                    startIndex + ((vertebra + 1) << 1),
                    firstVertebra + 3 * (vertebra + 2));
    }
};

/**
 * Render the top part of the tail
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} startIndex The index of the first fin vertex
 * @param {Number} firstVertebra The index of the first vertebra vertex
 */
Tail.prototype.renderTop = function(
    bodies,
    startIndex,
    firstVertebra) {
    for (let vertebra = 0; vertebra < this.anchors - 1; ++vertebra) {
        if (vertebra === this.anchors - 2)
            bodies.buffer.addIndices(
                firstVertebra + 3 * (vertebra + 2) - 1,
                firstVertebra + 3 * (vertebra + 1),
                startIndex + (vertebra << 1) + 1,
                startIndex + (vertebra << 1) + 1,
                startIndex + ((vertebra + 1) << 1) + 1,
                firstVertebra + 3 * (vertebra + 2) - 1);
        else
            bodies.buffer.addIndices(
                firstVertebra + 3 * (vertebra + 2),
                firstVertebra + 3 * (vertebra + 1),
                startIndex + (vertebra << 1) + 1,
                startIndex + (vertebra << 1) + 1,
                startIndex + ((vertebra + 1) << 1) + 1,
                firstVertebra + 3 * (vertebra + 2));
    }
};