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
    this.buffer = null;
};

/**
 * Make a Koi object, to be called once
 * @param {Systems} systems Render systems for this koi object
 * @returns {Koi} A koi object for this session
 */
Session.prototype.makeKoi = function(systems) {
    const koi = new Koi(systems, this.environmentSeed, this.random);

    if (this.buffer)
        koi.deserialize(this.buffer);
    else for (let i = 0; i < 1500; ++i)
        koi.update();

    return koi;
};

/**
 * Deserialize a session
 * @param {BinBuffer} buffer The buffer to deserialize from
 */
Session.prototype.deserialize = function(buffer) {
    this.buffer = buffer;

    this.random.deserialize(buffer);

    this.environmentSeed = buffer.readUint32();
};

/**
 * Serialize a session
 * @param {Koi} koi The Koi object to serialize
 * @returns {BinBuffer} A buffer containing the serialized session data
 */
Session.prototype.serialize = function(koi) {
    const buffer = new BinBuffer();

    this.random.serialize(buffer);

    buffer.writeUint32(this.environmentSeed);

    koi.serialize(buffer);

    return buffer;
};