/**
 * The state of a spawner object
 * @param {Number} [time] The time since the last spawn check
 * @param {Number} [school] The number of remaining school fish to spawn
 * @param {Blueprint} [spawning] The fish blueprint that is currently spawning
 * @constructor
 */
const SpawnerState = function(time = this.CHECK_FREQUENCY - 1, school = 0, spawning = null) {
    this.time = time;
    this.school = school;
    this.spawning = spawning;
};

SpawnerState.prototype.CHECK_FREQUENCY = 30;
SpawnerState.prototype.SPAWN_CHANCE = .1;
SpawnerState.prototype.BLUEPRINT_INITIAL = Blueprints.baseWhite;
SpawnerState.prototype.BLUEPRINTS = [
    Blueprints.baseWhite,
    Blueprints.baseBlack,
    Blueprints.baseGold,
    Blueprints.baseRed
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
 * Spawn the initial fish
 * @param {Constellation} constellation The constellation
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
SpawnerState.prototype.spawnInitial = function(
    constellation,
    atlas,
    patterns,
    randomSource,
    random) {
    constellation.big.addFish(this.BLUEPRINT_INITIAL.spawn(
        constellation.big.constraint.position.copy(),
        new Vector2().fromAngle(random.getFloat() * Math.PI * 2),
        atlas,
        patterns,
        randomSource,
        random));
    constellation.river.addFish(this.BLUEPRINT_INITIAL.spawn(
        constellation.initialSpawnPoint.copy(),
        constellation.initialSpawnDirection.copy(),
        atlas,
        patterns,
        randomSource,
        random));
};

/**
 * Update the spawner state
 * @param {SpawnerBehavior} behavior The current behavior
 * @param {Constellation} constellation The constellation
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Number} limit The maximum number of fish that may exist in the river
 * @param {Number} overhead The overhead to the maximum number of fish in the constellation
 * @param {Random} random A randomizer
 */
SpawnerState.prototype.update = function(
    behavior,
    constellation,
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
                constellation.river.addFish(this.spawning.spawn(
                    constellation.spawnPoint.copy(),
                    constellation.spawnDirection.copy(),
                    atlas,
                    patterns,
                    randomSource,
                    random));

            --this.school;
        }
        else {
            this.spawning = behavior.getBlueprint(random);

            if (this.spawning && constellation.river.getFishCount() < limit)
                this.school = behavior.getSchoolSize(this.spawning, random);
        }
    }
};