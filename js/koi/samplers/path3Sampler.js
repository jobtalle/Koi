/**
 * A 3D path sampler
 * @param {Path3} path The path to sample
 * @param {Number} [precision] The length of linear segments
 * @constructor
 */
const Path3Sampler = function(path, precision = this.PRECISION) {
    PathSampler.call(this);

    this.points = [path.getStart()];
    this.lengths = [this.length];

    let lastSample = this.points[0];
    const sample = lastSample.copy();

    for (let t = 0; t < 1; t += this.EPSILON) {
        path.sample(sample, t);

        const dx = sample.x - lastSample.x;
        const dy = sample.y - lastSample.y;
        const dz = sample.z - lastSample.z;
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);

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

Path3Sampler.prototype = Object.create(PathSampler.prototype);
Path3Sampler.prototype.PRECISION = .05;

/**
 * Get the start of this path
 * @returns {Vector3} The starting point
 */
Path3Sampler.prototype.getStart = function() {
    return this.points[0];
};

/**
 * Sample the path at a certain length
 * @param {Vector3} vector The vector to store the sample in
 * @param {Number} at The distance from the starting point, no higher than the path length
 */
Path3Sampler.prototype.sample = function(vector, at) {
    let startIndex = 0;

    // TODO: Optimize by guessing
    while (this.lengths[startIndex + 1] < at)
        ++startIndex;

    const dx = this.points[startIndex + 1].x - this.points[startIndex].x;
    const dy = this.points[startIndex + 1].y - this.points[startIndex].y;
    const dz = this.points[startIndex + 1].z - this.points[startIndex].z;
    const pointDistance = this.lengths[startIndex + 1] - this.lengths[startIndex];
    const distance = at - this.lengths[startIndex];
    const traveled = distance / pointDistance;

    vector.set(this.points[startIndex]);
    vector.x += dx * traveled;
    vector.y += dy * traveled;
    vector.z += dz * traveled;
};