Plants.prototype.LEAF_RESOLUTION = .15;
Plants.prototype.LEAF_SEGMENTS_MIN = 5;
Plants.prototype.LEAF_BULGE = .5;
Plants.prototype.LEAF_SHADE = .8;

/**
 * Model a leaf
 * @param {Vector2} flexVector The flex vector at the root of this leaf
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Z origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} y The Y position
 * @param {Number} width The leaf width factor, proportional to length
 * @param {Number} flex The flexibility
 * @param {Vector2} uv The air UV
 * @param {Color} color The leaf color
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelLeaf = function(
    flexVector,
    x1,
    z1,
    x2,
    z2,
    y,
    width,
    flex,
    uv,
    color,
    vertices,
    indices) {
    const firstIndex = this.getFirstIndex(vertices);
    const dx = x2 - x1;
    const dz = z2 - z1;
    const length = Math.sqrt(dx * dx + dz * dz);
    const dxn = dx / length;
    const dzn = dz / length;
    const segments = Math.max(this.LEAF_SEGMENTS_MIN, Math.round(length / this.LEAF_RESOLUTION) + 1);

    const shadeLeft = dxn < 0 ? this.LEAF_SHADE : 1;
    const shadeRight = dxn < 0 ? 1 : this.LEAF_SHADE;
    const centerOffset = (dxn < 0 ? this.LEAF_BULGE : -this.LEAF_BULGE) * (1 - Math.abs(dzn));

    vertices.push(
        color.r * shadeLeft,
        color.g * shadeLeft,
        color.b * shadeLeft,
        x1,
        y,
        z1,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y,
        color.r * shadeRight,
        color.g * shadeRight,
        color.b * shadeRight,
        x1,
        y,
        z1,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y);

    indices.push(
        firstIndex,
        firstIndex + 2,
        firstIndex + 3,
        firstIndex + 1,
        firstIndex + 4,
        firstIndex + 5);

    for (let segment = 1; segment < segments - 1; ++segment) {
        const f = segment / (segments - 1);
        const radius = length * width * .5 * Math.cos(Math.PI * (f - .5));

        vertices.push(
            color.r * shadeLeft,
            color.g * shadeLeft,
            color.b * shadeLeft,
            x1 + dx * f + dzn * radius * centerOffset,
            y,
            z1 + dz * f - dxn * radius * centerOffset,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y,
            color.r * shadeRight,
            color.g * shadeRight,
            color.b * shadeRight,
            x1 + dx * f + dzn * radius,
            y,
            z1 + dz * f - dxn * radius,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);

        vertices.push(
            color.r * shadeRight,
            color.g * shadeRight,
            color.b * shadeRight,
            x1 + dx * f + dzn * radius * centerOffset,
            y,
            z1 + dz * f - dxn * radius * centerOffset,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y,
            color.r * shadeLeft,
            color.g * shadeLeft,
            color.b * shadeLeft,
            x1 + dx * f - dzn * radius,
            y,
            z1 + dz * f + dxn * radius,
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);

        if (segment !== segments - 2)
            indices.push(
                firstIndex + (segment << 2) - 2,
                firstIndex + (segment << 2) - 1,
                firstIndex + (segment << 2) + 3,
                firstIndex + (segment << 2) + 3,
                firstIndex + (segment << 2) + 2,
                firstIndex + (segment << 2) - 2,
                firstIndex + (segment << 2),
                firstIndex + (segment << 2) + 1,
                firstIndex + (segment << 2) + 5,
                firstIndex + (segment << 2) + 5,
                firstIndex + (segment << 2) + 4,
                firstIndex + (segment << 2));
        else
            indices.push(
                firstIndex + (segment << 2) - 2,
                firstIndex + (segment << 2) - 1,
                firstIndex + (segment << 2) + 2,
                firstIndex + (segment << 2),
                firstIndex + (segment << 2) + 1,
                firstIndex + (segment << 2) + 3);
    }

    vertices.push(
        color.r * shadeLeft,
        color.g * shadeLeft,
        color.b * shadeLeft,
        x2,
        y,
        z2,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y,
        color.r * shadeRight,
        color.g * shadeRight,
        color.b * shadeRight,
        x2,
        y,
        z2,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y);

    new FlexSampler(x1, z1, flex).applyToRange(
        vertices,
        firstIndex,
        firstIndex + ((segments - 1) << 2) - 1);
};