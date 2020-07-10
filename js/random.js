/**
 * A fast & simple LCG random number generator
 * @param {Number} [seed] An integer value to use as a seed
 * @constructor
 */
const Random = function(seed = Random.prototype.makeSeed()) {
    this.n = seed;
};

Random.prototype.MULTIPLIER = 69069;
Random.prototype.MODULUS = 2 ** 32;
Random.prototype.INCREMENT = 1;

/**
 * Make a 32 bit seed using the default randomizer
 * @returns A random 32 bit seed
 */
Random.prototype.makeSeed = function() {
    return Math.floor(Math.random() * this.MODULUS);
};

/**
 * Generate a float
 * @returns {Number} A pseudorandom float in the range [0, 1>
 */
Random.prototype.getFloat = function() {
    this.n = (this.MULTIPLIER * this.n + this.INCREMENT) % this.MODULUS;

    return this.n / this.MODULUS;
};

/**
 * Serialize this randomizer
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Random.prototype.serialize = function(buffer) {
    buffer.writeUint32(this.n);
};

/**
 * Deserialize this randomizer
 * @param {BinBuffer} buffer A buffer to deserialize from
 */
Random.prototype.deserialize = function(buffer) {
    this.n = buffer.readUint32();
};