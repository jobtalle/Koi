/**
 * Mutate a fin shape layer in place
 * @param {LayerShapeFin} layer The fin shape layer
 * @constructor
 */
const MutatorLayerShapeFin = function(layer) {
    this.layer = layer;
};

MutatorLayerShapeFin.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerShapeFin.prototype.mutate = function(random) {
    // TODO: Mutate
};