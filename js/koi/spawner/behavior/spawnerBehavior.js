/**
 * Spawner behavior
 * @param {Blueprint[]} blueprints A set of blueprints to choose from
 * @param {Number} chance The chance that a spawn operation is performed on get()
 * @constructor
 */
const SpawnerBehavior = function(blueprints, chance) {
    this.blueprints = blueprints;
    this.chance = chance;
};

/**
 * Get the index of the blueprint to spawn
 * @returns {Number} The blueprint index
 */
SpawnerBehavior.prototype.getBlueprintIndex = function() {
    return 0;
};

/**
 * Get a fish to spawn
 * @param {Random} random A randomizer
 * @returns {Blueprint} The blueprint of the fish to spawn, nor null if none should be spawned
 */
SpawnerBehavior.prototype.get = function(random) {
    if (this.chance !== 1 && random.getFloat() > this.chance)
        return null;

    return this.blueprints[this.getBlueprintIndex()];
};