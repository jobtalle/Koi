/**
 * Biome information for a constellation
 * @param {Constellation} constellation The constellation
 * @param {Number} width The biome width
 * @param {Number} height The biome height
 * @param {Random} random A randomizer
 * @constructor
 */
const Biome = function(constellation, width, height, random) {
    this.noiseRocksPonds = new CubicNoise(
        Math.ceil(width * this.ROCKS_NOISE_SCALE),
        Math.ceil(height * this.ROCKS_NOISE_SCALE),
        random);
    this.noiseRocksRiver = this.noiseRocksPonds.createSimilar();
    this.sdfWidth = Math.ceil(width * this.SDF_RESOLUTION) + 1;
    this.sdf = this.makeSDF(constellation, width, height);
};

Biome.prototype.ROCKS_NOISE_SCALE = .9;
Biome.prototype.ROCKS_NOISE_THRESHOLD = .36;
Biome.prototype.SDF_RESOLUTION = 3;

/**
 * Create a SDF encoding distance to water
 * @param {Constellation} constellation The constellation
 * @param {Number} width The biome width
 * @param {Number} height The biome height
 * @returns {Number[]} The SDF
 */
Biome.prototype.makeSDF = function(constellation, width, height) {
    const sdfHeight = Math.ceil(height * this.SDF_RESOLUTION) + 1;
    const sdf = new Array(this.sdfWidth * sdfHeight);

    for (let y = 0; y < sdfHeight; ++y) for (let x = 0; x < this.sdfWidth; ++x)
        sdf[x + y * this.sdfWidth] = constellation.distanceToWater(
            x / this.SDF_RESOLUTION,
            y / this.SDF_RESOLUTION);

    return sdf;
};

/**
 * Sample the SDF
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The distance to the nearest shore
 */
Biome.prototype.sampleSDF = function(x, y) {
    const xi = Math.floor(x * this.SDF_RESOLUTION);
    const yi = Math.floor(y * this.SDF_RESOLUTION);
    const xf = (x * this.SDF_RESOLUTION - xi);
    const yf = (y * this.SDF_RESOLUTION - yi);
    const top = this.sdf[yi * this.sdfWidth + xi] +
        (this.sdf[yi * this.sdfWidth + xi + 1] - this.sdf[yi * this.sdfWidth + xi]) * xf;
    const bottom = this.sdf[(yi + 1) * this.sdfWidth + xi] +
        (this.sdf[(yi + 1) * this.sdfWidth + xi + 1] - this.sdf[(yi + 1) * this.sdfWidth + xi]) * xf;

    return top + (bottom - top) * yf;
};

/**
 * Sample the ponds rocks intensity
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The rocks intensity in the range [0, 1]
 */
Biome.prototype.sampleRocksPonds = function(x, y) {
    const intensity = this.noiseRocksPonds.sample(x * this.ROCKS_NOISE_SCALE, y * this.ROCKS_NOISE_SCALE);

    return (intensity - this.ROCKS_NOISE_THRESHOLD) / (1 - this.ROCKS_NOISE_THRESHOLD);
};

/**
 * Sample the river rocks intensity
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Number} The rocks intensity in the range [0, 1]
 */
Biome.prototype.sampleRocksRiver = function(x, y) {
    const intensity = this.noiseRocksRiver.sample(x * this.ROCKS_NOISE_SCALE, y * this.ROCKS_NOISE_SCALE);

    return (intensity - this.ROCKS_NOISE_THRESHOLD) / (1 - this.ROCKS_NOISE_THRESHOLD);
};