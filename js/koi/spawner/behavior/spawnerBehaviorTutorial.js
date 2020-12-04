/**
 * Spawner behavior for the tutorial
 * @constructor
 */
const SpawnerBehaviorTutorial = function() {
    SpawnerBehavior.call(this, [Blueprints.baseWhite, Blueprints.baseBlack], 1);

    this.index = 0;
};

SpawnerBehaviorTutorial.prototype = Object.create(SpawnerBehavior.prototype);

/**
 * Get the index of the blueprint to spawn
 * @returns {Number} The blueprint index
 */
SpawnerBehaviorTutorial.prototype.getBlueprintIndex = function() {
    this.index = 1 - this.index;

    return this.index;
};