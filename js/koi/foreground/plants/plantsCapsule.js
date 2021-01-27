Plants.prototype.CAPSULE_SEGMENTS_MIN = 3;
Plants.prototype.CAPSULE_RESOLUTION = .11;
Plants.prototype.CAPSULE_RADIUS_POWER = .25;

/**
 * Model a capsule shape
 * @param {Path2Sampler} pathSampler The path to model the capsule on
 * @param {Bounds} bounds The bounds to model the stalk on
 * @param {Number} y The Y position
 * @param {Number} radius The capsule radius
 * @param {Vector2} uv The air UV
 * @param {Color} color The capsule color
 * @param {Number} shade The shade multiplier
 * @param {FlexSampler} flexSampler A flex sampler
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelCapsule = function(
    pathSampler,
    bounds,
    y,
    radius,
    uv,
    color,
    shade,
    flexSampler,
    vertices,
    indices) {

    const firstIndex = this.getFirstIndex(vertices);
    const segments = Math.max(
        this.CAPSULE_SEGMENTS_MIN,
        Math.round(pathSampler.getLength() * bounds.getDomain() / this.CAPSULE_RESOLUTION) + 1);
    const sample = new Vector2();
    const direction = new Vector2();

    pathSampler.sample(sample, pathSampler.getLength() * bounds.min);

    vertices.push(
        color.r * .5 * (shade + 1),
        color.g * .5 * (shade + 1),
        color.b * .5 * (shade + 1),
        sample.x,
        y,
        sample.y,
        0,
        0,
        uv.x,
        uv.y);
    indices.push(
        firstIndex,
        firstIndex + 1,
        firstIndex + 2);

    for (let segment = 1; segment < segments - 1; ++segment) {
        const f = segment / (segments - 1);
        const at = pathSampler.getLength() * bounds.map(f);

        pathSampler.sample(sample, at);
        pathSampler.sampleDirection(direction, at);

        const r = radius * Math.pow(Math.cos(Math.PI * (f - .5)), this.CAPSULE_RADIUS_POWER);

        vertices.push(
            color.r * shade,
            color.g * shade,
            color.b * shade,
            sample.x - direction.y * r,
            y,
            sample.y + direction.x * r,
            0,
            0,
            uv.x,
            uv.y);
        vertices.push(
            color.r,
            color.g,
            color.b,
            sample.x + direction.y * r,
            y,
            sample.y - direction.x * r,
            0,
            0,
            uv.x,
            uv.y);

        if (segment !== segments - 2)
            indices.push(
                firstIndex + (segment << 1) - 1,
                firstIndex + (segment << 1),
                firstIndex + (segment << 1) + 2,
                firstIndex + (segment << 1) + 2,
                firstIndex + (segment << 1) + 1,
                firstIndex + (segment << 1) - 1);
    }

    pathSampler.sample(sample, pathSampler.getLength() * bounds.max);

    vertices.push(
        color.r * .5 * (shade + 1),
        color.g * .5 * (shade + 1),
        color.b * .5 * (shade + 1),
        sample.x,
        y,
        sample.y,
        0,
        0,
        uv.x,
        uv.y);
    indices.push(
        firstIndex + ((segments - 2) << 1) - 1,
        firstIndex + ((segments - 2) << 1),
        firstIndex + ((segments - 2) << 1) + 1);

    flexSampler.applyToRange(vertices, firstIndex, firstIndex + ((segments - 1) << 1) - 1);
};