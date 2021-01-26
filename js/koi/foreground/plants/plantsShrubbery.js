Plants.prototype.SHRUBBERY_COLOR_LEAF = Color.fromCSS("--color-shrubbery-leaf");

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
    const leafSet = new LeafSet(
        x,
        0,
        x,
        3,
        1,
        .3, // density
        .5, // min angle
        1, // max angle
        .8, // root length
        .35, // top length
        .6, // leaf width
        .04, // flex min
        .22, // flex max
        random);

    this.modelStalk(
        x,
        0,
        x,
        3,
        y,
        .05,
        .5,
        uv,
        this.CATTAIL_COLOR_STALK,
        this.CATTAIL_COLOR_STALK,
        this.CATTAIL_STALK_SHADE,
        flexSampler,
        vertices,
        indices);

    leafSet.model(y, uv, this.SHRUBBERY_COLOR_LEAF, this, flexSampler, random, vertices, indices);
};