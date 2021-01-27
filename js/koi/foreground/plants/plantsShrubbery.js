Plants.prototype.SHRUBBERY_COLOR_STALK = Color.fromCSS("--color-shrubbery-stalk");
Plants.prototype.SHRUBBERY_COLOR_LEAF = Color.fromCSS("--color-shrubbery-leaf");
Plants.prototype.SHRUBBERY_STALK_SHADE = .65;
Plants.prototype.SHRUBBERY_LENGTH = new SamplerPower(2, 4, 1.9);
Plants.prototype.SHRUBBERY_CONTROL_HEIGHT = .8;
Plants.prototype.SHRUBBERY_STALK_RADIUS = .05;

/**
 * Model a shrubbery
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} size A size factor in the range [0, 1]
 * @param {Sampler} angle A sample for the angles
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @param {Number} [radius] The stalk radius
 */
Plants.prototype.modelShrubbery = function(
    x,
    y,
    size,
    angle,
    random,
    vertices,
    indices,
    radius = this.SHRUBBERY_STALK_RADIUS) {
    const uv = this.makeUV(x, y, random);
    const flexSampler = new FlexSampler(x, 0, new SamplerPower(0, .1, 1.8), this.SHRUBBERY_LENGTH.max * size);
    const length = this.SHRUBBERY_LENGTH.sample(random.getFloat()) * size;
    const direction = angle.sample(random.getFloat());
    const end = new Vector2(x + Math.cos(direction) * length, Math.sin(direction) * length);
    const controlPoint = new Vector2(x, end.y * this.SHRUBBERY_CONTROL_HEIGHT);
    const pathSampler = new Path2Sampler(
        new Path2QuadraticBezier(
            new Vector2(x, 0),
            controlPoint,
            end));
    const leafSet = new LeafSet(
        pathSampler,
        new SamplerPower(.1, .95, 1.1),
        .27, // density
        new Sampler(1.1, 1.3), // Leaf angle
        new Sampler(.8, .35), // root length
        .6, // leaf width
        new Sampler(.08, .2), // flex
        random);

    this.modelStalk(
        pathSampler,
        y,
        radius,
        .5,
        uv,
        this.SHRUBBERY_COLOR_STALK,
        this.SHRUBBERY_COLOR_STALK,
        this.SHRUBBERY_STALK_SHADE,
        flexSampler,
        vertices,
        indices);

    leafSet.model(y, uv, this.SHRUBBERY_COLOR_LEAF, this, flexSampler, random, vertices, indices);
};