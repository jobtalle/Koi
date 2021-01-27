Plants.prototype.SHRUBBERY_COLOR_STALK = Color.fromCSS("--color-shrubbery-stalk");
Plants.prototype.SHRUBBERY_COLOR_LEAF = Color.fromCSS("--color-shrubbery-leaf");
Plants.prototype.SHRUBBERY_STALK_SHADE = .65;

/**
 * Model a shrubbery
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} size A size factor in the range [0, 1]
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelShrubbery = function(
    x,
    y,
    size,
    random,
    vertices,
    indices) {
    const uv = this.makeUV(x, y, random);
    const flexSampler = new FlexSampler(x, 0, new SamplerPower(0, .1, 1.8), 3);
    const pathSampler = new Path2Sampler(
        new Path2QuadraticBezier(new Vector2(x, 0), new Vector2(x, 2), new Vector2(x + 1, 3)));
    const leafSet = new LeafSet(
        pathSampler,
        new Bounds(.1, 1),
        1.2, // Distribution power
        .3, // density
        new Sampler(.5, 1.3), // Angle
        .8, // root length
        .35, // top length
        .7, // leaf width
        .08, // flex min
        .4, // flex max
        random);

    this.modelStalk(
        pathSampler,
        y,
        .05,
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