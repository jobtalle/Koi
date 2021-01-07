/**
 * Mutate a fin shape layer in place
 * @param {LayerShapeFin} layer The fin shape layer
 * @constructor
 */
const MutatorLayerShapeFin = function(layer) {
    this.layer = layer;
};

MutatorLayerShapeFin.prototype = Object.create(Mutator.prototype);
MutatorLayerShapeFin.prototype.SAMPLER_ROUNDNESS = new SamplerPlateau(-8, 0, 8, 1);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerShapeFin.prototype.mutate = function(random) {
    this.layer.roundness = this.mutateUint8(this.layer.roundness, this.SAMPLER_ROUNDNESS, random.getFloat());
};