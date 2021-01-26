/**
 * An approximation of a path consisting of many small linear paths
 * @param {Path} path The path to sample
 * @param {Number} [precision] The length of linear segments
 * @constructor
 */
const PathSamplerSegmented = function(path, precision = this.PRECISION) {
    this.length = 0;
    this.points = [path.getStart()];
    this.lengths = [this.length];

    let lastSample = path.getStart();
    const sample = lastSample.copy();

    for (let t = 0; t < 1; t += this.EPSILON) {
        path.sample(sample, t);

        const d = lastSample.copy().subtract(sample).length();

        if (d > precision) {
            lastSample = sample.copy();

            this.length += d;
            this.points.push(lastSample);
            this.lengths.push(this.length);
        }
    }

    this.points.push(path.getEnd());
    this.length += path.getEnd().copy().subtract(lastSample).length();
    this.lengths.push(this.length);
};

PathSamplerSegmented.prototype.PRECISION = .05;
PathSamplerSegmented.prototype.EPSILON = .005;

/**
 * Get the exact length
 * @returns {*}
 */
PathSamplerSegmented.prototype.getLength = function() {
    return this.length;
};

/**
 * Sample the path at a certain length
 * @param {Object} vector The vector to store the sample in
 * @param {Number} at The distance from the starting point, no higher than the path length
 */
PathSamplerSegmented.prototype.sample = function(vector, at) {
    let startIndex = 0;

    // TODO: Optimize by guessing
    while (this.lengths[startIndex + 1] < at)
        ++startIndex;

    const pointDistance = this.lengths[startIndex + 1] - this.lengths[startIndex];
    const distance = at - this.lengths[startIndex];
    const traveled = distance / pointDistance;

    vector.set(this.points[startIndex + 1]).subtract(this.points[startIndex]).multiply(traveled).add(this.points[startIndex]);
};