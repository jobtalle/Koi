Plants.prototype.CAPSULE_SEGMENTS_MIN = 3;
Plants.prototype.CAPSULE_RESOLUTION = .11;
Plants.prototype.CAPSULE_RADIUS_POWER = .25;

/**
 * Model a capsule shape
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Z origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} y The Y position
 * @param {Number} radius The capsule radius
 * @param {Vector2} uv The air UV
 * @param {Color} color The capsule color
 * @param {Number} shade The shade multiplier
 * @param {Plants.FlexSampler} flexSampler A flex sampler
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelCapsule = function(
    x1,
    z1,
    x2,
    z2,
    y,
    radius,
    uv,
    color,
    shade,
    flexSampler,
    vertices,
    indices) {

    const firstIndex = this.getFirstIndex(vertices);
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dz * dz);
    const nx = -dz / length;
    const nz = dx / length;
    const segments = Math.max(this.CAPSULE_SEGMENTS_MIN, Math.round(length / this.CAPSULE_RESOLUTION) + 1);

    vertices.push(
        color.r * shade,
        color.g * shade,
        color.b * shade,
        x1,
        y,
        z1,
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
        const x = x1 + dx * f;
        const z = z1 + dz * f;
        const r = radius * Math.pow(Math.cos(Math.PI * (f - .5)), this.CAPSULE_RADIUS_POWER);

        vertices.push(
            color.r * shade,
            color.g * shade,
            color.b * shade,
            x + nx * r,
            y,
            z + nz * r,
            0,
            0,
            uv.x,
            uv.y);
        vertices.push(
            color.r,
            color.g,
            color.b,
            x - nx * r,
            y,
            z - nz * r,
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

    vertices.push(
        color.r * shade,
        color.g * shade,
        color.b * shade,
        x2,
        y,
        z2,
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