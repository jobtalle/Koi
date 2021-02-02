Plants.prototype.SHRUBBERY_COLOR_STALK = Color.fromCSS("--color-shrubbery-stalk");
Plants.prototype.SHRUBBERY_COLOR_LEAF = Color.fromCSS("--color-shrubbery-leaf");
Plants.prototype.SHRUBBERY_STALK_SHADE = .65;
Plants.prototype.SHRUBBERY_STALK_RADIUS = .05;
Plants.prototype.SHRUBBERY_STALK_RADIUS_POWER = .5;
Plants.prototype.SHRUBBERY_LENGTH = new SamplerPower(2.3, 3.7, 1.5);
Plants.prototype.SHRUBBERY_CONTROL_HEIGHT = .8;
Plants.prototype.SHRUBBERY_LENGTH_MULTIPLIER = new Sampler(.4, 1);
Plants.prototype.SHRUBBERY_DIRECTION = new SamplerPlateau(Math.PI * .4, Math.PI * .5, Math.PI * .6, .1);
Plants.prototype.SHRUBBERY_DIRECTION_AMPLITUDE = Math.PI * .07;
Plants.prototype.SHRUBBERY_DIRECTION_REVERSE_CHANCE = .07;
Plants.prototype.SHRUBBERY_FLEX = new SamplerPower(0, .1, 1.8);
Plants.prototype.SHRUBBERY_LEAF_ANGLE = new Sampler(1.1, 1.3);
Plants.prototype.SHRUBBERY_LEAF_WIDTH = .6;
Plants.prototype.SHRUBBERY_LEAF_FLEX = new Sampler(.08, .2);
Plants.prototype.SHRUBBERY_LEAF_LENGTH = new Sampler(.85, .3);
Plants.prototype.SHRUBBERY_LEAF_DENSITY = .25;
Plants.prototype.SHRUBBERY_LEAF_DISTRIBUTION = new SamplerPower(.1, 1, 1.1);

/**
 * Model a shrubbery
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} size A size factor in the range [0, 1]
 * @param {Number} waterDirection The direction towards the nearest water, -1 or 1
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelShrubbery = function(
    x,
    y,
    size,
    waterDirection,
    random,
    vertices,
    indices) {
    if (random.getFloat() < this.SHRUBBERY_DIRECTION_REVERSE_CHANCE)
        waterDirection = -waterDirection;

    const direction = this.SHRUBBERY_DIRECTION.sample(random.getFloat()) - waterDirection * this.SHRUBBERY_DIRECTION_AMPLITUDE;
    const uv = this.makeUV(x, y, random);
    const sizeMultiplier = this.SHRUBBERY_LENGTH_MULTIPLIER.sample(size);
    const flexSampler = new FlexSampler(x, 0, this.SHRUBBERY_FLEX, this.SHRUBBERY_LENGTH.max * sizeMultiplier);
    const length = this.SHRUBBERY_LENGTH.sample(random.getFloat()) * sizeMultiplier;
    const end = new Vector2(x + Math.cos(direction) * length, Math.sin(direction) * length);
    const controlPoint = new Vector2(x, end.y * this.SHRUBBERY_CONTROL_HEIGHT);
    const pathSampler = new Path2Sampler(
        new Path2QuadraticBezier(
            new Vector2(x, 0),
            controlPoint,
            end));
    const leafSet = new LeafSet(
        pathSampler,
        this.SHRUBBERY_LEAF_DISTRIBUTION,
        this.SHRUBBERY_LEAF_DENSITY,
        this.SHRUBBERY_LEAF_ANGLE,
        this.SHRUBBERY_LEAF_LENGTH,
        this.SHRUBBERY_LEAF_WIDTH,
        this.SHRUBBERY_LEAF_FLEX,
        random);

    this.modelStalk(
        pathSampler,
        y,
        this.SHRUBBERY_STALK_RADIUS,
        this.SHRUBBERY_STALK_RADIUS_POWER,
        uv,
        this.SHRUBBERY_COLOR_STALK,
        this.SHRUBBERY_COLOR_STALK,
        this.SHRUBBERY_STALK_SHADE,
        flexSampler,
        vertices,
        indices);

    leafSet.model(y, uv, this.SHRUBBERY_COLOR_LEAF, this, flexSampler, random, vertices, indices);
};