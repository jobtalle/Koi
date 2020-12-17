Plants.prototype.STALK_RESOLUTION = .3;

/**
 * Model a stalk
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Y origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} y The Y position
 * @param {Number} radius The stalk radius
 * @param {Number} radiusPower A power to apply to the radius
 * @param {Vector2} uv The air UV
 * @param {Color} color The color
 * @param {Number} shade The dark side shade
 * @param {FlexSampler} flexSampler A flex sampler
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelStalk = function(
    x1,
    z1,
    x2,
    z2,
    y,
    radius,
    radiusPower,
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
    const segments = Math.max(2, Math.round(length / this.STALK_RESOLUTION) + 1);

    for (let segment = 0; segment < segments - 1; ++segment) {
        const f = segment / (segments - 1);
        const x = x1 + dx * f;
        const z = z1 + dz * f;
        const r = radius * Math.pow(1 - f, radiusPower);

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
            uv.y,
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
                firstIndex + (segment << 1),
                firstIndex + (segment << 1) + 1,
                firstIndex + (segment << 1) + 3,
                firstIndex + (segment << 1) + 3,
                firstIndex + (segment << 1) + 2,
                firstIndex + (segment << 1));
        else
            indices.push(
                firstIndex + (segment << 1),
                firstIndex + (segment << 1) + 1,
                firstIndex + (segment << 1) + 2);
    }

    vertices.push(
        color.r * (1 - (1 - shade) * .5),
        color.g * (1 - (1 - shade) * .5),
        color.b * (1 - (1 - shade) * .5),
        x2,
        y,
        z2,
        0,
        0,
        uv.x,
        uv.y);

    flexSampler.applyToRange(vertices, firstIndex, firstIndex + ((segments - 1) << 1));
};