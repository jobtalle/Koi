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
 * @param {AudioBank} audio Game audio
 * @param {GUI} gui The GUI
 * @returns {Koi} A koi object for this session
 */
Session.prototype.makeKoi = function(systems, audio, gui) {
    const koi = new Koi(systems, audio, gui, this.environmentSeed, this.random);

    if (this.buffer) {
        koi.deserialize(this.buffer);
        gui.deserialize(this.buffer);

        this.buffer = null;
    }
    else for (let i = 0; i < 1500; ++i)
        koi.update();

    return koi;
};

/**
 * Deserialize a session
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Session.prototype.deserialize = function(buffer) {
    this.buffer = buffer;

    this.random.deserialize(buffer);

    this.environmentSeed = buffer.readUint32();
};

/**
 * Serialize a session
 * @param {Koi} koi The Koi object to serialize
 * @param {GUI} gui The GUI object to serialize
 * @returns {BinBuffer} A buffer containing the serialized session data
 */
Session.prototype.serialize = function(koi, gui) {
    const buffer = new BinBuffer();

    this.random.serialize(buffer);

    buffer.writeUint32(this.environmentSeed);

    koi.serialize(buffer);
    gui.serialize(buffer);

    return buffer;
};