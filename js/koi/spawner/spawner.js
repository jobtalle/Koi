/**
 * The fish spawner
 * @param {Constellation} constellation A constellation to spawn fish in
 * @param {SpawnerState} [state] The state of this spawner
 * @constructor
 */
const Spawner = function(constellation, state = new SpawnerState()) {
    this.constellation = constellation;
    this.state = state;
    this.time = 0;
};

Spawner.prototype.SPAWN_OVERHEAD = 8;
Spawner.prototype.SPAWN_LIMIT = 16;

/**
 * Set the spawner state
 * @param {SpawnerState} state The spawner state
 */
Spawner.prototype.setState = function(state) {
    this.state = state;
};

/**
 * Get the spawner state
 * @returns {SpawnerState} The spawner state
 */
Spawner.prototype.getState = function() {
    return this.state;
};

/**
 * Spawn the initial fish
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
Spawner.prototype.spawnInitial = function(atlas, patterns, randomSource, random) {
    this.state.spawnInitial(
        this.constellation,
        atlas,
        patterns,
        randomSource,
        random);
};

/**
 * Update the spawner
 * @param {Number} timeStep The amount of time passed since the last update
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The patterns
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 */
Spawner.prototype.update = function(
    timeStep,
    atlas,
    patterns,
    randomSource,
    random) {
    this.state.update(
        this.constellation,
        atlas,
        patterns,
        randomSource,
        this.SPAWN_LIMIT,
        this.SPAWN_OVERHEAD,
        random);
};