/**
 * Mutate a ridge layer in place
 * @param {LayerRidge} layer The ridge layer
 * @constructor
 */
const MutatorLayerRidge = function(layer) {
    this.layer = layer;
};

MutatorLayerRidge.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerRidge.prototype.mutate = function(random) {
    // TODO
};