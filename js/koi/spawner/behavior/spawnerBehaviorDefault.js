/**
 * Default spawner behavior
 * @constructor
 */
const SpawnerBehaviorDefault = function() {
    SpawnerBehavior.call(this, this.BLUEPRINTS, this.SPAWN_CHANCE);
};

SpawnerBehaviorDefault.prototype = Object.create(SpawnerBehavior.prototype);
SpawnerBehaviorDefault.prototype.SPAWN_CHANCE = .09;
SpawnerBehaviorDefault.prototype.BLUEPRINTS = SpawnerState.prototype.BLUEPRINTS;

/**
 * Get the index of the blueprint to spawn
 * @param {Random} random The randomizer
 * @returns {Number} The blueprint index
 */
SpawnerBehaviorDefault.prototype.getBlueprintIndex = function(random) {
    return Math.floor(this.BLUEPRINTS.length * random.getFloat());
};