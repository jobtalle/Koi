/**
 * Mutate a base layer in place
 * @param {LayerBase} layer The base layer
 * @constructor
 */
const MutatorLayerBase = function(layer) {
    this.layer = layer;
};

MutatorLayerBase.prototype = Object.create(Mutator.prototype);
MutatorLayerBase.prototype.SAMPLER_DISTANCE = new SamplerQuadratic(0, 2, 5);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerBase.prototype.mutate = function(random) {
    this.mutatePalette(this.layer.paletteSample, this.SAMPLER_DISTANCE, random);
};