/**
 * The state of a spawner object
 * @param {Number} [time] The time since the last spawn check
 * @param {Number} [school] The number of remaining school fish to spawn
 * @param {Blueprint} [spawning] The fish blueprint that is currently spawning
 * @constructor
 */
const SpawnerState = function(time = 0, school = 0, spawning = null) {
    this.time = time;
    this.school = school;
    this.spawning = spawning;
};

SpawnerState.prototype.CHECK_FREQUENCY = 30;
SpawnerState.prototype.BLUEPRINTS = [
    // Black koi
    new Blueprint(
        new SamplerPlateau(1, 2, 5, 1),
        new Sampler(130, 170),
        new Sampler(150, 160),
        new Sampler(2, 4),
        new Sampler(20000, 25000),
        new BlueprintBody(
            new Sampler(150, 180),
            new Sampler(80, 100),
            new BlueprintFins(),
            new BlueprintTail(
                new Sampler(100, 140),
                new Sampler(180, 220)),
            new BlueprintPattern(
                new BlueprintLayerBase(1),
                new BlueprintLayerShapeBody(
                    new Sampler(50, 100),
                    new Sampler(170, 200),
                    new Sampler(160, 170)),
                new BlueprintLayerShapeFin(
                    new Sampler(200, 230)),
                [
                    new BlueprintLayerSpots(
                        0,
                        new Sampler(50, 100),
                        new Sampler(120, 136),
                        new Sampler(80, 100),
                        new Sampler(120, 136),
                        new Sampler(120, 136),
                        new Sampler(30, 50))
                ]))),
    // Big red spotted koi
    new Blueprint(
        new SamplerPlateau(2, 3, 4, 1),
        new Sampler(170, 200),
        new Sampler(180, 200),
        new Sampler(4, 6),
        new Sampler(25000, 30000),
        new BlueprintBody(
            new Sampler(160, 200),
            new Sampler(130, 150),
            new BlueprintFins(),
            new BlueprintTail(
                new Sampler(120, 150),
                new Sampler(100, 120)),
            new BlueprintPattern(
                new BlueprintLayerBase(0),
                new BlueprintLayerShapeBody(
                    new Sampler(220, 240),
                    new Sampler(120, 140),
                    new Sampler(150, 160)),
                new BlueprintLayerShapeFin(
                    new Sampler(60, 90)),
                [
                    new BlueprintLayerSpots(
                        1,
                        new Sampler(50, 100),
                        new Sampler(120, 136),
                        new Sampler(80, 100),
                        new Sampler(120, 136),
                        new Sampler(120, 136),
                        new Sampler(30, 50))
                ])))
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

    if (school !== 0 && spawningIndex === SpawnerState.prototype.BLUEPRINTS.length)
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

/**
 * Update the spawner state
 * @param {Constellation} constellation The constellation
 * @param {Pond} river The river
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Number} limit The maximum number of fish that may exist in the river
 * @param {Number} overhead The overhead to the maximum number of fish in the constellation
 * @param {Random} random A randomizer
 */
SpawnerState.prototype.update = function(
    constellation,
    river,
    atlas,
    patterns,
    randomSource,
    limit,
    overhead,
    random) {
    if (++this.time === this.CHECK_FREQUENCY) {
        this.time = 0;

        if (this.school !== 0) {
            if (constellation.getFishCount() + overhead < Koi.prototype.FISH_CAPACITY)
                river.addFish(this.spawning.spawn(
                    constellation.spawnPoint.copy(),
                    constellation.spawnDirection.copy(),
                    atlas,
                    patterns,
                    randomSource,
                    random));

            --this.school;
            console.log("Spawn");
        }
        else if (river.getFishCount() < limit && random.getFloat() < .1) {
            // TODO: Choose blueprint
            this.spawning = this.BLUEPRINTS[Math.floor(this.BLUEPRINTS.length * random.getFloat())];
            this.school = this.spawning.getSchoolSize(random);

            console.log("Primed " + this.school);
        }
    }
};