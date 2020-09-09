/**
 * A gust of frequency
 * @param {Vector2} from The wave front start position
 * @param {Vector2} to The wave front end position
 * @param {Number} distance The distance to move
 * @param {Number} speed The speed
 * @param {Number} intensity The gust intensity
 * @param {Random} random A randomizer
 * @constructor
 */
const Gust = function(from, to, distance, speed, intensity, random) {
    this.distance = distance;
    this.speed = speed;
    this.intensity = intensity;
    this.moved = 0;
    this.from = from;
    this.dx = to.x - from.x;
    this.dy = to.y - from.y;
    this.pointCount = this.calculatePointCount();
    this.offsets = this.makeOffsets(this.pointCount, random);
};

Gust.prototype.POINT_SPACING = 2.5;
Gust.prototype.RADIUS_LEADING = .8;
Gust.prototype.RADIUS_TRAILING = .3;
Gust.prototype.LAG_AMPLITUDE = 2;
Gust.prototype.LAG_POWER = 2.5;

/**
 * Calculate the number of points for this gust
 * @returns {Number} The point count
 */
Gust.prototype.calculatePointCount = function() {
    const waveFrontLength = Math.sqrt(this.dx * this.dx + this.dy * this.dy);

    return Math.ceil(waveFrontLength / this.POINT_SPACING) + 1;
};

/**
 * Make point offsets
 * @param {Number} pointCount The number of points
 * @param {Random} random A randomizer
 * @returns {Number[]} An array of offsets
 */
Gust.prototype.makeOffsets = function(pointCount, random) {
    const offsets = new Array(pointCount);

    for (let offset = 0; offset < offsets.length; ++offset)
        offsets[offset] = this.LAG_AMPLITUDE * Math.pow(random.getFloat(), this.LAG_POWER);

    return offsets;
};

/**
 * Update the frequency gust
 * @param {Air} air The air
 * @returns {Boolean} A boolean indicating whether this frequency gust should be removed
 */
Gust.prototype.update = function(air) {
    const scale = air.influences.scale;
    const progress = this.moved / this.distance;
    const intensity = Math.sin(Math.PI * progress) * this.intensity;
    const firstIndex = air.influences.meshBuffer.getVertexCount();

    for (let point = 0; point <= this.pointCount; ++point) {
        const offset = this.offsets[point];
        const progress = point / this.pointCount;
        const x = this.from.x + this.dx * point / this.pointCount + this.moved;
        const y = this.from.y + this.dy * point / this.pointCount;

        air.influences.meshBuffer.addVertices(
            (x - offset - this.RADIUS_TRAILING) * scale,
            y * scale,
            0,
            0,
            0,
            (x - offset) * scale,
            y * scale,
            0,
            0,
            Math.sin(Math.PI * progress) * intensity,
            (x - offset + this.RADIUS_LEADING) * scale,
            y * scale,
            0,
            0,
            0);

        if (point !== this.pointCount)
            air.influences.meshBuffer.addIndices(
                firstIndex + 3 * point,
                firstIndex + 3 * point + 1,
                firstIndex + 3 * point + 4,
                firstIndex + 3 * point + 4,
                firstIndex + 3 * point + 3,
                firstIndex + 3 * point,
                firstIndex + 3 * point + 1,
                firstIndex + 3 * point + 2,
                firstIndex + 3 * point + 5,
                firstIndex + 3 * point + 5,
                firstIndex + 3 * point + 4,
                firstIndex + 3 * point + 1);
    }

    this.moved += this.speed;

    return this.moved > this.distance;
};