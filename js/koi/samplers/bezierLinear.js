/**
 * A linear sampler for a bezier path
 * @param {Bezier} bezier The bezier curve to sample linearly
 * @param {Number} precision The length of the linear segments
 */
const BezierLinear = function(bezier, precision) {
    this.points = new Array(Math.max(2, Math.round(bezier.length() / precision) + 1));
    this.points[0] = bezier.a;
    this.points[this.points.length - 1] = bezier.b;
    this.lengths = new Array(this.points.length);
    this.lengths[0] = 0;
    this.length = 0;

    for (let point = 1, pointCount = this.points.length; point < pointCount; ++point) {
        const t = point / (pointCount - 1);
        const vector = new Vector2();

        this.points[point] = bezier.sample(vector, t);

        const dx = vector.x - this.points[point - 1].x;
        const dy = vector.y - this.points[point - 1].y;
        const d = Math.sqrt(dx * dx + dy * dy);

        this.length += d;
        this.lengths[point] = this.length;
    }
};

/**
 * Get the start position of this curve
 */
BezierLinear.prototype.getStart = function() {
    return this.points[0];
};

/**
 * Sample the path at a certain length
 * @param {Vector2} vector The vector to store the sample in
 * @param {Number} at The distance from the starting point, no higher than the path length
 */
BezierLinear.prototype.sample = function(vector, at) {
    let startIndex = 0;

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