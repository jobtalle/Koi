/**
 * A blueprint for a random set of fins
 * @constructor
 */
const BlueprintFins = function() {

};

/**
 * Spawn a set of fins
 * @param {Random} random A randomizer
 * @returns {Fin[]} A set of fins
 */
BlueprintFins.prototype.spawn = function(random) {
    // TODO: Randomize
    return [
        new Fin(.2, 1.4, 1),
        new Fin(.5, .8, 1)
    ];
};