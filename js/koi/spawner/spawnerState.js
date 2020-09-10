/**
 * The state of a spawner object
 * @param {Number} [time] The time since the last spawn check
 * @param {Number} [school] The number of remaining school fish to spawn
 * @param {Number} [spawning] The fish blueprint that is currently spawning
 * @constructor
 */
const SpawnerState = function(time = 0, school = 0, spawning = null) {
    this.time = time;
    this.school = school;
    this.spawning = spawning;
};

SpawnerState.prototype.CHECK_FREQUENCY = 60;
SpawnerState.prototype.BLUEPRINTS = [
    new Blueprint(
        new SamplerPlateau(2, 6, 5, 1),
        new Sampler(170, 200),
        new Sampler(180, 200),
        new Sampler(4, 6),
        new Sampler(25000, 30000),
        new BlueprintBody(
            new SamplerPlateau(50, 150, 120, 5),
            new Sampler(100, 120),
            new BlueprintFins(),
            new BlueprintTail(
                new Sampler(120, 150),
                new Sampler(100, 120)),
            new BlueprintPattern()))
];

/**
 * Deserialize the spawner state
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @returns {SpawnerState} The deserialized spawner state
 * @throws {RangeError} A range error when deserialized values are out of range
 */
SpawnerState.deserialize = function(buffer) {
    const time = buffer.readUint8();
    const school = buffer.readUint8();
    const spawningIndex = buffer.readUint8();

    if (time > SpawnerState.prototype.CHECK_FREQUENCY)
        throw new RangeError();

    // TODO: Validate school range

    if (spawningIndex > SpawnerState.prototype.BLUEPRINTS.length)
        throw new RangeError();

    return new SpawnerState(
        time,
        school,
        spawningIndex === SpawnerState.prototype.BLUEPRINTS.length ?
            null :
            SpawnerState.prototype.BLUEPRINTS[spawningIndex]);
};

/**
 * Serialize the spawner state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
SpawnerState.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.time);
    buffer.writeUint8(this.school);

    if (this.spawning === null)
        buffer.writeUint8(this.BLUEPRINTS.length);
    else
        buffer.writeUint8(this.BLUEPRINTS.indexOf(this.spawning));
};