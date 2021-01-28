Plants.prototype.STALK_RESOLUTION = .3;

/**
 * Model a stalk
 * @param {Path2Sampler} pathSampler The path sampler to model the stalk along
 * @param {Number} y The Y position
 * @param {Number} radius The stalk radius
 * @param {Number} radiusPower A power to apply to the radius
 * @param {Vector2} uv The air UV
 * @param {Color} colorBase The base color
 * @param {Color} color The color
 * @param {Number} shade The dark side shade
 * @param {FlexSampler} flexSampler A flex sampler
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelStalk = function(
    pathSampler,
    y,
    radius,
    radiusPower,
    uv,
    colorBase,
    color,
    shade,
    flexSampler,
    vertices,
    indices) {
    const firstIndex = this.getFirstIndex(vertices);
    const sample = new Vector2();
    const direction = new Vector2();
    const segments = Math.max(2, Math.round(pathSampler.getLength() / this.STALK_RESOLUTION) + 1);

    for (let segment = 0; segment < segments - 1; ++segment) {
        const f = segment / (segments - 1);
        const r = radius * Math.pow(1 - f, radiusPower);
        const at = f * pathSampler.getLength();

        pathSampler.sample(sample, at);
        pathSampler.sampleDirection(direction, at);

        if (segment === 0) {
            if (colorBase === color)
                vertices.push(
                    colorBase.r * shade,
                    colorBase.g * shade,
                    colorBase.b * shade);
            else
                vertices.push(
                    colorBase.r,
                    colorBase.g,
                    colorBase.b);
        }
        else
            vertices.push(
                color.r * shade,
                color.g * shade,
                color.b * shade);

        vertices.push(
            sample.x - direction.y * r,
            y,
            sample.y + direction.x * r,
            0,
            0,
            uv.x,
            uv.y);

        if (segment === 0)
            vertices.push(
                colorBase.r,
                colorBase.g,
                colorBase.b);
        else
            vertices.push(
                color.r,
                color.g,
                color.b);

        vertices.push(
            sample.x + direction.y * r,
            y,
            sample.y - direction.x * r,
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
        pathSampler.getPath().getEnd().x,
        y,
        pathSampler.getPath().getEnd().y,
        0,
        0,
        uv.x,
        uv.y);

    flexSampler.applyToRange(vertices, firstIndex, firstIndex + ((segments - 1) << 1));
};