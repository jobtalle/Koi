/**
 * A fast & simple LCG random number generator
 * @param {Number} [seed] An integer value to use as a seed
 * @constructor
 */
const Random = function(seed = Math.floor(Math.random() * this.MODULUS)) {
    this.n = seed;
};

Random.prototype.MULTIPLIER = 69069;
Random.prototype.MODULUS = 2 ** 32;
Random.prototype.INCREMENT = 1;

/**
 * Generate a float
 * @returns {Number} A pseudorandom float in the range [0, 1>
 */
Random.prototype.getFloat = function() {
    this.n = (this.MULTIPLIER * this.n + this.INCREMENT) % this.MODULUS;

    return this.n / this.MODULUS;
};