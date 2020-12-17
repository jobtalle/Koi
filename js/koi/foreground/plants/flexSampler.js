/**
 * A flex vector sampler
 * @param {Number} xOrigin The X origin
 * @param {Number} zOrigin The Z origin
 * @param {Number|Sampler} amount The amount of flex, or a sampler
 * @param {Number} [length] The maximum distance from the origin, required if amount is a sampler
 * @param {Vector2} [baseFlex] The flex vector to add to
 * @constructor
 */
FlexSampler = function(
    xOrigin,
    zOrigin,
    amount,
    length = 0,
    baseFlex = new Vector2()) {
    this.xOrigin = xOrigin;
    this.zOrigin = zOrigin;
    this.amount = amount;
    this.baseFlex = baseFlex;
    this.length = length;
};

FlexSampler.prototype.EPSILON = .001;

/**
 * Sample a flex vector
 * @param {Number} x The vertex X position
 * @param {Number} z The vertex Z position
 * @returns {Vector2} The flex vector
 */
FlexSampler.prototype.sample = function(x, z) {
    const dx = x - this.xOrigin;
    const dz = z - this.zOrigin;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const flex = this.amount instanceof Sampler ? this.amount.sample(dist / this.length) : this.amount;

    return new Vector2(dz, dx).multiply(flex).add(this.baseFlex);
};

/**
 * Sample the angle of a flex point on this sampler
 * @param {Number} x The vertex X position
 * @param {Number} z The vertex Z position
 * @returns {Number} The angle of the flex rotation at this point at maximum flex
 */
FlexSampler.prototype.sampleAngle = function(x, z) {
    const sa = new Vector2(x, z - this.EPSILON);
    const sb = new Vector2(x, z + this.EPSILON);

    sa.add(this.sample(sa.x, sa.y));
    sb.add(this.sample(sb.x, sb.y));

    return -Math.atan2(
        sb.x - sa.x,
        sb.y - sa.y);
};

/**
 * Apply this sampler cumulatively to a range of vertices
 * @param {Number[]} vertices The vertex data array
 * @param {Number} start The start of the range
 * @param {Number} end The end of the range
 */
FlexSampler.prototype.applyToRange = function(vertices, start, end) {
    for (let i = start; i <= end; ++i) {
        const index = i * Plants.prototype.STRIDE;
        const flexVector = this.sample(vertices[index + 3], vertices[index + 5]);

        vertices[index + 6] = flexVector.x;
        vertices[index + 7] = flexVector.y;
    }
};