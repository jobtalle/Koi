/**
 * Mutate a base layer in place
 * @param {LayerBase} layer The base layer
 * @constructor
 */
const MutatorLayerBase = function(layer) {
    this.layer = layer;
};

MutatorLayerBase.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerBase.prototype.mutate = function(random) {

};