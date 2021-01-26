Plants.prototype.GRASS_COLOR_A = Color.fromCSS("--color-grass-a");
Plants.prototype.GRASS_COLOR_B = Color.fromCSS("--color-grass-b");
Plants.prototype.GRASS_COLOR_BASE = Color.fromCSS("--color-earth");
Plants.prototype.GRASS_COLOR_DARKEN_RANDOM = .15;
Plants.prototype.GRASS_COLOR_DARKEN_BIOME = 2;
Plants.prototype.GRASS_FLEX_MAX = new Sampler(.2, .4);
Plants.prototype.GRASS_FLEX_POWER = 1.7;
Plants.prototype.GRASS_HEIGHT = new SamplerPower(.55, .75, 1.4);
Plants.prototype.GRASS_BLADES = 3;
Plants.prototype.GRASS_FAN = new SamplerPower(.2, .24, .6);
Plants.prototype.GRASS_SHADE = .85;
Plants.prototype.GRASS_RADIUS = .19;
Plants.prototype.GRASS_RADIUS_POWER = .8;
Plants.prototype.GRASS_SHORE_GRADIENT = .5;
Plants.prototype.GRASS_SHORE_WIDTH = .3;
Plants.prototype.GRASS_Y_SHIFT = new Sampler(-.01, .01);

/**
 * Model grass
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} darken A color multiplier in the range [0, 1]
 * @param {Number} shoreDistance The distance to the nearest shore
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelGrass = function(
    x,
    y,
    darken,
    shoreDistance,
    random,
    vertices,
    indices) {
    const color = this.GRASS_COLOR_A.lerp(
        this.GRASS_COLOR_B,
        Math.min(1, darken * this.GRASS_COLOR_DARKEN_BIOME)).multiply(
            1 - this.GRASS_COLOR_DARKEN_RANDOM * random.getFloat());
    const colorBase = this.GRASS_COLOR_BASE.lerp(
        color,
        Math.min(1, Math.max(0, shoreDistance - this.GRASS_SHORE_WIDTH) / this.GRASS_SHORE_GRADIENT));
    const flexSampler = new FlexSampler(
        x,
        0,
        new SamplerPower(0, this.GRASS_FLEX_MAX.sample(random.getFloat()), this.GRASS_FLEX_POWER),
        this.GRASS_HEIGHT.max);

    for (let i = 0; i < this.GRASS_BLADES; ++i) {
        const height = this.GRASS_HEIGHT.sample(random.getFloat());
        const angle = Math.PI * .5 + ((i / (this.GRASS_BLADES - 1)) * 2 - 1) * this.GRASS_FAN.sample(random.getFloat());

        this.modelStalk(
            new Path2Linear(new Vector2(x, 0), new Vector2(x + Math.cos(angle) * height, Math.sin(angle) * height)),
            y + this.GRASS_Y_SHIFT.sample(random.getFloat()),
            this.GRASS_RADIUS * height,
            this.GRASS_RADIUS_POWER,
            this.makeUV(x, y, random),
            colorBase,
            color,
            this.GRASS_SHADE,
            flexSampler,
            vertices,
            indices);
    }
};
