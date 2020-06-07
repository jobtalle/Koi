Plants.prototype.STALK_RESOLUTION = .3;

/**
 * Model a stalk
 * @param {Number} x1 The X origin
 * @param {Number} z1 The Y origin
 * @param {Number} x2 The X target
 * @param {Number} z2 The Z target
 * @param {Number} y The Y position
 * @param {Number} radius The stalk radius
 * @param {Vector2} uv The air UV
 * @param {Color} color The color
 * @param {Number} shade The dark side shade
 * @param {Number} flex The amount of flex
 * @param {Number} flexPower The flex power
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
    uv,
    color,
    shade,
    flex,
    flexPower,
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
        const flexVector = this.makeFlexVector(
            flex * Math.pow(f, flexPower),
            x,
            z,
            x1,
            z1);

        vertices.push(
            color.r * shade,
            color.g * shade,
            color.b * shade,
            x + nx * radius * (1 - f),
            y,
            z + nz * radius * (1 - f),
            flexVector.x,
            flexVector.y,
            uv.x,
            uv.y);
        vertices.push(
            color.r,
            color.g,
            color.b,
            x - nx * radius * (1 - f),
            y,
            z - nz * radius * (1 - f),
            flexVector.x,
            flexVector.y,
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

    const flexVector = this.makeFlexVector(
        flex,
        x2,
        z2,
        x1,
        z1);

    vertices.push(
        color.r * (1 - (1 - shade) * .5),
        color.g * (1 - (1 - shade) * .5),
        color.b * (1 - (1 - shade) * .5),
        x2,
        y,
        z2,
        flexVector.x,
        flexVector.y,
        uv.x,
        uv.y);
};