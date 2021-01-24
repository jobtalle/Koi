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
SpawnerState.prototype.BLUEPRINTS = [
    // White
    new Blueprint(
        // School size
        new SamplerPlateau(1, 2, 5, 1),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(150, 180),
            // Radius
            new Sampler(180, 220),
            // Growth speed
            new Sampler(130, 170),
            // Mating frequency
            new Sampler(150, 160),
            // Offspring count
            new Sampler(130, 170),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136)),
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136))),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(100, 140),
                // Skew
                new Sampler(150, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_WHITE),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(50, 100),
                    // Radius power
                    new Sampler(170, 200),
                    // Eye position
                    new Sampler(50, 100)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Angle
                    new Sampler(200, 250),
                    // Inset
                    new Sampler(110, 160),
                    // Dips
                    new Sampler(30, 60),
                    // Dip power
                    new Sampler(110, 160),
                    // Roundness
                    new Sampler(110, 160)),
                // Layers
                []
            )
        )
    ),
    // Black
    new Blueprint(
        // School size
        new SamplerPlateau(2, 4, 10, 1.7),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(120, 160),
            // Radius
            new Sampler(200, 235),
            // Growth speed
            new Sampler(130, 170),
            // Mating frequency
            new Sampler(150, 160),
            // Offspring count
            new Sampler(130, 170),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136)),
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136))),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(100, 140),
                // Skew
                new Sampler(150, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_BLACK),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(50, 100),
                    // Radius power
                    new Sampler(170, 200),
                    // Eye position
                    new Sampler(50, 100)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Angle
                    new Sampler(200, 250),
                    // Inset
                    new Sampler(110, 160),
                    // Dips
                    new Sampler(110, 160),
                    // Dip power
                    new Sampler(110, 160),
                    // Roundness
                    new Sampler(110, 160)),
                // Layers
                []
            )
        )
    ),
    // Gold
    new Blueprint(
        // School size
        new SamplerPlateau(1, 2, 5, 1),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(20, 40),
            // Radius
            new Sampler(200, 235),
            // Growth speed
            new Sampler(130, 170),
            // Mating frequency
            new Sampler(150, 160),
            // Offspring count
            new Sampler(130, 170),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136)),
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136))),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(100, 140),
                // Skew
                new Sampler(150, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_GOLD),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(50, 100),
                    // Radius power
                    new Sampler(170, 200),
                    // Eye position
                    new Sampler(50, 100)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Angle
                    new Sampler(200, 250),
                    // Inset
                    new Sampler(110, 160),
                    // Dips
                    new Sampler(160, 190),
                    // Dip power
                    new Sampler(110, 160),
                    // Roundness
                    new Sampler(110, 160)),
                // Layers
                []
            )
        )
    ),
    // Brown
    new Blueprint(
        // School size
        new SamplerPlateau(1, 3, 5, 1),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(200, 230),
            // Radius
            new Sampler(50, 70),
            // Growth speed
            new Sampler(20, 40),
            // Mating frequency
            new Sampler(200, 225),
            // Offspring count
            new Sampler(170, 190),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136)),
                new BlueprintFin(
                    new Sampler(110, 136),
                    new Sampler(110, 136))),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(220, 250),
                // Skew
                new Sampler(200, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_BROWN),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(80, 140),
                    // Radius power
                    new Sampler(180, 210),
                    // Eye position
                    new Sampler(20, 30)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Angle
                    new Sampler(200, 250),
                    // Inset
                    new Sampler(110, 160),
                    // Dips
                    new Sampler(110, 160),
                    // Dip power
                    new Sampler(110, 160),
                    // Roundness
                    new Sampler(110, 160)),
                // Layers
                []
            )
        )
    )
];
SpawnerState.prototype.BLUEPRINT_INITIAL = SpawnerState.prototype.BLUEPRINTS[0];
SpawnerState.prototype.BLUEPRINTS_TUTORIAL = [
    SpawnerState.prototype.BLUEPRINTS[0],
    SpawnerState.prototype.BLUEPRINTS[1]];

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
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
SpawnerState.prototype.spawnInitial = function(
    constellation,
    atlas,
    randomSource,
    random) {
    constellation.big.addFish(this.BLUEPRINT_INITIAL.spawn(
        constellation.big.constraint.position.copy(),
        new Vector2().fromAngle(random.getFloat() * Math.PI * 2),
        atlas,
        randomSource,
        random));
    constellation.river.addFish(this.BLUEPRINT_INITIAL.spawn(
        constellation.initialSpawnPoint.copy(),
        constellation.initialSpawnDirection.copy(),
        atlas,
        randomSource,
        random));
};

/**
 * Update the spawner state
 * @param {SpawnerBehavior} behavior The current behavior
 * @param {Constellation} constellation The constellation
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {WeatherState} weatherState The weather state
 * @param {RandomSource} randomSource A random source
 * @param {Number} limit The maximum number of fish that may exist in the river
 * @param {Number} overhead The overhead to the maximum number of fish in the constellation
 * @param {Random} random A randomizer
 */
SpawnerState.prototype.update = function(
    behavior,
    constellation,
    atlas,
    weatherState,
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
                    randomSource,
                    random));

            --this.school;
        }
        else {
            this.spawning = behavior.getBlueprint(weatherState, random);

            if (this.spawning && constellation.river.getFishCount() < limit)
                this.school = behavior.getSchoolSize(this.spawning, random);
        }
    }
};