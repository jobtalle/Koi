Plants.prototype.CATTAIL_COLOR_STALK = Color.fromCSS("--color-cattail-stalk");
Plants.prototype.CATTAIL_COLOR_CAPSULE = Color.fromCSS("--color-cattail-capsule");
Plants.prototype.CATTAIL_COLOR_LEAF = Color.fromCSS("--color-cattail-leaf");
Plants.prototype.CATTAIL_ANGLE_RADIUS = .05;
Plants.prototype.CATTAIL_FLEX = new SamplerPower(0, .15, 1.5);
Plants.prototype.CATTAIL_HEIGHT = new SamplerPower(1.5, 2.1, 1.5);
Plants.prototype.CATTAIL_STALK_RADIUS = .02;
Plants.prototype.CATTAIL_STALK_RADIUS_POWER = .7;
Plants.prototype.CATTAIL_STALK_SHADE = .7;
Plants.prototype.CATTAIL_LEAVES_PLACEMENT = new SamplerPower(.1, .55, 1.5);
Plants.prototype.CATTAIL_LEAVES_DENSITY = .36;
Plants.prototype.CATTAIL_LEAVES_ANGLE = new Sampler(.8, 1.5);
Plants.prototype.CATTAIL_LEAVES_LENGTH = new Sampler(.8, .35);
Plants.prototype.CATTAIL_LEAVES_WIDTH = .6;
Plants.prototype.CATTAIL_LEAVES_FLEX = new Sampler(.04, .22);
Plants.prototype.CATTAIL_CAPSULE_BOUNDS = new Bounds(.65, .95);
Plants.prototype.CATTAIL_CAPSULE_RADIUS = .04;
Plants.prototype.CATTAIL_CAPSULE_SHADE = .65;
Plants.prototype.CATTAIL_CAPSULE_SPOT = new SamplerPlateau(.2, .5, .8, 0.5);

/**
 * Model cattail
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @returns {BugSpot[]} Spots for bugs to land on
 */
Plants.prototype.modelCattail = function(
    x,
    y,
    random,
    vertices,
    indices) {
    const uv = this.makeUV(x, y, random);
    const height = this.CATTAIL_HEIGHT.sample(random.getFloat());

    const direction = Math.PI * .5 + (random.getFloat() * 2 - 1) * this.CATTAIL_ANGLE_RADIUS;
    const directionCos = Math.cos(direction);
    const directionSin = Math.sin(direction);
    const flexSampler = new FlexSampler(x, 0, this.CATTAIL_FLEX, height);
    const pathSampler = new Path2Sampler(
        new Path2Linear(new Vector2(x, 0), new Vector2(x + directionCos * height, directionSin * height)));
    const leafSet = new LeafSet(
        pathSampler,
        this.CATTAIL_LEAVES_PLACEMENT,
        this.CATTAIL_LEAVES_DENSITY,
        this.CATTAIL_LEAVES_ANGLE,
        this.CATTAIL_LEAVES_LENGTH,
        this.CATTAIL_LEAVES_WIDTH,
        this.CATTAIL_LEAVES_FLEX,
        random);

    this.modelCapsule(
        pathSampler,
        this.CATTAIL_CAPSULE_BOUNDS,
        y,
        this.CATTAIL_CAPSULE_RADIUS * height,
        uv,
        this.CATTAIL_COLOR_CAPSULE,
        this.CATTAIL_CAPSULE_SHADE,
        flexSampler,
        vertices,
        indices);

    this.modelStalk(
        pathSampler,
        y,
        this.CATTAIL_STALK_RADIUS * height,
        this.CATTAIL_STALK_RADIUS_POWER,
        uv,
        this.CATTAIL_COLOR_STALK,
        this.CATTAIL_COLOR_STALK,
        this.CATTAIL_STALK_SHADE,
        flexSampler,
        vertices,
        indices);

    leafSet.model(
        y,
        uv,
        this.CATTAIL_COLOR_LEAF,
        this,
        flexSampler,
        random,
        vertices,
        indices);

    const bugSpot = new Vector2();

    pathSampler.sample(bugSpot, pathSampler.getLength() * this.CATTAIL_CAPSULE_BOUNDS.map(
        this.CATTAIL_CAPSULE_SPOT.sample(random.getFloat())));

    return [new BugSpot(new Vector3(bugSpot.x, y, bugSpot.y), uv, flexSampler)];
};