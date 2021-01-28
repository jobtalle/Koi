/**
 * A blueprint for a random set of fins
 * @param {BlueprintFin} front The front fin
 * @param {BlueprintFin} back The back fin
 * @constructor
 */
const BlueprintFins = function(front, back) {
    this.front = front;
    this.back = back;
};

/**
 * Spawn a set of fins
 * @param {Random} random A randomizer
 * @returns {Fins} A set of fins
 */
BlueprintFins.prototype.spawn = function(random) {
    return new Fins(
        this.front.spawn(random),
        this.back.spawn(random));
};