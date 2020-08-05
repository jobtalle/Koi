/**
 * Mutate a spots layer in place
 * @param {LayerSpots} layer The spots layer
 * @constructor
 */
const MutatorLayerSpots = function(layer) {
    this.layer = layer;
};

MutatorLayerSpots.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerSpots.prototype.mutate = function(random) {
    // TODO: Mutate
};