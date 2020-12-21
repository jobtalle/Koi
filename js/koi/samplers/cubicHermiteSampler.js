/**
 * A linear cubic hermite sampler
 * @param {CubicHermite} cubicHermite A cubic hermite spline
 * @param {Number} precision The length of linear segments
 * @constructor
 */
const CubicHermiteSampler = function(cubicHermite, precision) {
    this.length = 0;
    this.points = [cubicHermite.getStart()];
    this.lengths = [this.length];

    let lastSample = this.points[0];
    const sample = lastSample.copy();

    for (let t = 0; t < 1; t += this.EPSILON) {
        cubicHermite.sample(sample, t);

        const dx = sample.x - lastSample.x;
        const dy = sample.y - lastSample.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d > precision) {
            lastSample = sample.copy();

            this.length += d;
            this.points.push(lastSample);
            this.lengths.push(this.length);
        }
    }

    this.points.push(cubicHermite.getEnd());
    this.length += cubicHermite.getEnd().copy().subtract(lastSample).length();
    this.lengths.push(this.length);
};

CubicHermiteSampler.prototype.EPSILON = .005;

/**
 * Sample the path at a certain length
 * @param {Vector2} vector The vector to store the sample in
 * @param {Number} at The distance from the starting point, no higher than the path length
 */
CubicHermiteSampler.prototype.sample = function(vector, at) {
    let startIndex = 0;

    // TODO: Optimize by guessing
    while (this.lengths[startIndex + 1] < at)
        ++startIndex;

    const dx = this.points[startIndex + 1].x - this.points[startIndex].x;
    const dy = this.points[startIndex + 1].y - this.points[startIndex].y;
    const pointDistance = this.lengths[startIndex + 1] - this.lengths[startIndex];
    const distance = at - this.lengths[startIndex];
    const traveled = distance / pointDistance;

    vector.set(this.points[startIndex]);
    vector.x += dx * traveled;
    vector.y += dy * traveled;
};

/**
 * Get the start of this curve
 * @returns {Vector2} The starting point
 */
CubicHermiteSampler.prototype.getStart = function() {
    return this.points[0];
};

/**
 * Get the end of this curve
 * @returns {Vector2} The end point
 */
CubicHermiteSampler.prototype.getEnd = function() {
    return this.points[this.points.length - 1];
};