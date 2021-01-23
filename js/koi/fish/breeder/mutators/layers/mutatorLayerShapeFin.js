/**
 * Mutate a fin shape layer in place
 * @param {LayerShapeFin} layer The fin shape layer
 * @constructor
 */
const MutatorLayerShapeFin = function(layer) {
    this.layer = layer;
};

MutatorLayerShapeFin.prototype = Object.create(Mutator.prototype);
MutatorLayerShapeFin.prototype.SAMPLER_ANGLE = new SamplerPlateau(-12, 0, 12, 1);
MutatorLayerShapeFin.prototype.SAMPLER_INSET = new SamplerPlateau(-9, 0, 9, 1);
MutatorLayerShapeFin.prototype.SAMPLER_DIPS = new SamplerPlateau(-7, 0, 7, 1);
MutatorLayerShapeFin.prototype.SAMPLER_DIP_POWER = new SamplerPlateau(-11, 0, 11, 1);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerShapeFin.prototype.mutate = function(random) {
    this.layer.angle = this.mutateUint8(this.layer.angle, this.SAMPLER_ANGLE, random.getFloat());
    this.layer.inset = this.mutateUint8(this.layer.inset, this.SAMPLER_INSET, random.getFloat());
    this.layer.dips = this.mutateUint8(this.layer.dips, this.SAMPLER_DIPS, random.getFloat());
    this.layer.dipPower = this.mutateUint8(this.layer.dipPower, this.SAMPLER_DIP_POWER, random.getFloat());
};