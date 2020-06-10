/**
 * Biome information for a constellation
 * @param {Constellation} constellation The constellation
 * @param {Random} random A randomizer
 * @constructor
 */
const Biome = function(constellation, random) {
    this.noiseRocksPonds = new CubicNoise(
        Math.ceil(constellation.width * this.ROCKS_NOISE_SCALE),
        Math.ceil(constellation.height * this.ROCKS_NOISE_SCALE),
        random);
    this.noiseRocksRiver = this.noiseRocksPonds.createSimilar();
};

/**
 * Sample the ponds rocks intensity
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The rocks intensity in the range [0, 1]
 */
Biome.prototype.sampleRocksPonds = function(x, y) {
    const intensity = this.noiseRocksPonds.sample(x * this.ROCKS_NOISE_SCALE, y * this.ROCKS_NOISE_SCALE);

    return Math.max(0, (intensity - this.ROCKS_NOISE_THRESHOLD) / (1 - this.ROCKS_NOISE_THRESHOLD));
};

/**
 * Sample the river rocks intensity
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The rocks intensity in the range [0, 1]
 */
Biome.prototype.sampleRocksRiver = function(x, y) {
    const intensity = this.noiseRocksRiver.sample(x * this.ROCKS_NOISE_SCALE, y * this.ROCKS_NOISE_SCALE);

    return Math.max(0, (intensity - this.ROCKS_NOISE_THRESHOLD) / (1 - this.ROCKS_NOISE_THRESHOLD));
};

Biome.prototype.ROCKS_NOISE_SCALE = .7;
Biome.prototype.ROCKS_NOISE_THRESHOLD = .36;