/**
 * Spawner behavior for the tutorial
 * @constructor
 */
const SpawnerBehaviorTutorial = function() {
    SpawnerBehavior.call(this, [Blueprints.baseWhite, Blueprints.baseBlack], 1);

    this.index = 0;
    this.countdown = 1;
};

SpawnerBehaviorTutorial.prototype = Object.create(SpawnerBehavior.prototype);
SpawnerBehaviorTutorial.prototype.DELAY = 3;

/**
 * Get the index of the blueprint to spawn
 * @param {WeatherState} weatherState The weather state
 * @param {Random} random The randomizer
 * @returns {Number} The blueprint index
 */
SpawnerBehaviorTutorial.prototype.getBlueprintIndex = function(weatherState, random) {
    if (--this.countdown === 0) {
        this.index = 1 - this.index;
        this.countdown = this.DELAY;

        return this.index;
    }

    return -1;
};

/**
 * Get the school size for a given blueprint
 * @param {Blueprint} blueprint The blueprint
 * @param {Random} random A randomizer
 * @returns {Number} The school size
 */
SpawnerBehaviorTutorial.prototype.getSchoolSize = function(blueprint, random) {
    return 1;
};