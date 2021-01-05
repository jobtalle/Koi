Plants.prototype.GRASS_COLOR = Color.fromCSS("--color-grass");
Plants.prototype.GRASS_COLOR_DARKEN_RANDOM = .15;
Plants.prototype.GRASS_COLOR_DARKEN_BIOME = .5;
Plants.prototype.GRASS_FLEX_MAX = new Sampler(.2, .4);
Plants.prototype.GRASS_FLEX_POWER = 1.7;
Plants.prototype.GRASS_HEIGHT_MIN = .5;
Plants.prototype.GRASS_HEIGHT_MAX = .7;
Plants.prototype.GRASS_BLADES = 3;
Plants.prototype.GRASS_FAN = .23;
Plants.prototype.GRASS_SHADE = .85;
Plants.prototype.GRASS_RADIUS = .19;
Plants.prototype.GRASS_RADIUS_POWER = .8;

/**
 * Model grass
 * @param {Number} x The X origin
 * @param {Number} y The Y origin
 * @param {Number} darken A color multiplier in the range [0, 1]
 * @param {Random} random A randomizer
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Plants.prototype.modelGrass = function(x, y, darken, random, vertices, indices) {
    const height = this.GRASS_HEIGHT_MIN + (this.GRASS_HEIGHT_MAX - this.GRASS_HEIGHT_MIN) * random.getFloat();
    const color = this.GRASS_COLOR.copy().multiply(1 -
        this.GRASS_COLOR_DARKEN_RANDOM * random.getFloat() -
        this.GRASS_COLOR_DARKEN_BIOME * darken);
    const flexSampler = new FlexSampler(
        x,
        0,
        new SamplerPower(0, this.GRASS_FLEX_MAX.sample(random.getFloat()), this.GRASS_FLEX_POWER),
        height);

    for (let i = 0; i < this.GRASS_BLADES; ++i) {
        const angle = Math.PI * .5 + ((i / (this.GRASS_BLADES - 1)) * 2 - 1) * this.GRASS_FAN;

        this.modelStalk(
            x,
            0,
            x + Math.cos(angle) * height,
            Math.sin(angle) * height,
            y,
            this.GRASS_RADIUS * height,
            this.GRASS_RADIUS_POWER,
            this.makeUV(x, y, random),
            color,
            this.GRASS_SHADE,
            flexSampler,
            vertices,
            indices);
    }
};
