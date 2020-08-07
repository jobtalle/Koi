Plants.prototype.CATTAIL_COLOR_STALK = Color.fromCSS("--color-cattail-stalk");
Plants.prototype.CATTAIL_COLOR_CAPSULE = Color.fromCSS("--color-cattail-capsule");
Plants.prototype.CATTAIL_COLOR_LEAF = Color.fromCSS("--color-cattail-leaf");
Plants.prototype.CATTAIL_ANGLE_RADIUS = .05;
Plants.prototype.CATTAIL_FLEX = .15;
Plants.prototype.CATTAIL_FLEX_POWER = 1.5;
Plants.prototype.CATTAIL_HEIGHT_MIN = 1.5;
Plants.prototype.CATTAIL_HEIGHT_MAX = 2.1;
Plants.prototype.CATTAIL_HEIGHT_POWER = 1.5;
Plants.prototype.CATTAIL_STALK_RADIUS = .02;
Plants.prototype.CATTAIL_STALK_RADIUS_POWER = .7;
Plants.prototype.CATTAIL_STALK_SHADE = .7;
Plants.prototype.CATTAIL_LEAVES_START = .1;
Plants.prototype.CATTAIL_LEAVES_END = .55;
Plants.prototype.CATTAIL_LEAVES_DENSITY = .36;
Plants.prototype.CATTAIL_LEAVES_ANGLE_MIN = .8;
Plants.prototype.CATTAIL_LEAVES_ANGLE_MAX = 1.5;
Plants.prototype.CATTAIL_LEAVES_LENGTH_ROOT = .8;
Plants.prototype.CATTAIL_LEAVES_LENGTH_TIP = .35;
Plants.prototype.CATTAIL_LEAVES_WIDTH = .6;
Plants.prototype.CATTAIL_LEAVES_FLEX_MIN = .04;
Plants.prototype.CATTAIL_LEAVES_FLEX_MAX = .22;
Plants.prototype.CATTAIL_CAPSULE_START = .65;
Plants.prototype.CATTAIL_CAPSULE_END = .95;
Plants.prototype.CATTAIL_CAPSULE_RADIUS = .04;
Plants.prototype.CATTAIL_CAPSULE_SHADE = .75;

/**
 * Model cattail
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} size A size factor in the range [0, 1]
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelCattail = function(x, y, size, random, vertices, indices) {
    const uv = this.makeUV(x, y, random);
    const height = this.CATTAIL_HEIGHT_MIN + (this.CATTAIL_HEIGHT_MAX - this.CATTAIL_HEIGHT_MIN) *
        Math.pow(size * random.getFloat(), this.CATTAIL_HEIGHT_POWER);

    const capsuleStart = height * this.CATTAIL_CAPSULE_START;
    const capsuleEnd = height * this.CATTAIL_CAPSULE_END;
    const leafStart = height * this.CATTAIL_LEAVES_START;
    const leafEnd = height * this.CATTAIL_LEAVES_END;
    const direction = Math.PI * .5 + (random.getFloat() * 2 - 1) * this.CATTAIL_ANGLE_RADIUS;
    const directionCos = Math.cos(direction);
    const directionSin = Math.sin(direction);
    const flexSampler = new Plants.FlexSampler(x, 0, this.CATTAIL_FLEX, this.CATTAIL_FLEX_POWER, height);
    const leafSet = new Plants.LeafSet(
        x + directionCos * leafStart,
        directionSin * leafStart,
        x + directionCos * leafEnd,
        directionSin * leafEnd,
        this.CATTAIL_LEAVES_DENSITY,
        this.CATTAIL_LEAVES_ANGLE_MIN,
        this.CATTAIL_LEAVES_ANGLE_MAX,
        this.CATTAIL_LEAVES_LENGTH_ROOT,
        this.CATTAIL_LEAVES_LENGTH_TIP,
        this.CATTAIL_LEAVES_WIDTH,
        this.CATTAIL_LEAVES_FLEX_MIN,
        this.CATTAIL_LEAVES_FLEX_MAX,
        random);

    this.modelCapsule(
        x + directionCos * capsuleStart,
        directionSin * capsuleStart,
        x + directionCos * capsuleEnd,
        directionSin * capsuleEnd,
        y,
        this.CATTAIL_CAPSULE_RADIUS * height,
        uv,
        this.CATTAIL_COLOR_CAPSULE,
        this.CATTAIL_CAPSULE_SHADE,
        flexSampler,
        vertices,
        indices);

    this.modelStalk(
        x,
        0,
        x + directionCos * height,
        directionSin * height,
        y,
        this.CATTAIL_STALK_RADIUS * height,
        this.CATTAIL_STALK_RADIUS_POWER,
        uv,
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
};