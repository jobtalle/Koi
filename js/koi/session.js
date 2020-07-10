/**
 * A session containing user data
 * @param {Random} random The gameplay randomizer
 * @param {Number} environmentSeed A 32 bit integer seed for environment generation
 * @constructor
 */
const Session = function(
    random = new Random(),
    environmentSeed = Random.prototype.makeSeed()) {
    this.random = random;
    this.environmentSeed = environmentSeed;
};

/**
 * Deserialize a session
 * @param {BinBuffer} buffer The buffer to deserialize from
 */
Session.prototype.deserialize = function(buffer) {
    this.random.deserialize(buffer);

    this.environmentSeed = buffer.readUint32();
};

/**
 * Serialize a session
 * @returns {BinBuffer} A buffer containing the session
 */
Session.prototype.serialize = function() {
    const buffer = new BinBuffer();

    this.random.serialize(buffer);

    buffer.writeUint32(this.environmentSeed);

    return buffer;
};