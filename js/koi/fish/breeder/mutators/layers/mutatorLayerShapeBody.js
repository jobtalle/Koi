/**
 * Mutate a body shape layer in place
 * @param {LayerShapeBody} layer The body shape layer
 * @constructor
 */
const MutatorLayerShapeBody = function(layer) {
    this.layer = layer;
};

MutatorLayerShapeBody.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerShapeBody.prototype.mutate = function(random) {
    // TODO: Mutate
};