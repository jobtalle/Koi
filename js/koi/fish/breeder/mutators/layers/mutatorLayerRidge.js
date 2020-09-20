/**
 * Mutate a ridge layer in place
 * @param {LayerRidge} layer The ridge layer
 * @constructor
 */
const MutatorLayerRidge = function(layer) {
    this.layer = layer;
};

MutatorLayerRidge.prototype = Object.create(Mutator.prototype);
MutatorLayerRidge.prototype.SAMPLER_PALETTE_DISTANCE = new SamplerPower(0, 1.1, 7);
MutatorLayerRidge.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 3, 4);
MutatorLayerRidge.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, .6, 4);
MutatorLayerRidge.prototype.SAMPLER_SCALE = new SamplerPlateau(-9, 0, 9, 1.5);
MutatorLayerRidge.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-6.5, 0, 6.5, 2);
MutatorLayerRidge.prototype.SAMPLER_FOCUS = new SamplerPlateau(-7, 0, 7, 4);
MutatorLayerRidge.prototype.SAMPLER_FOCUS_POWER = new SamplerPlateau(-6, 0, 6, 2.6);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerRidge.prototype.mutate = function(random) {
    this.mutateVector3(this.layer.plane.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.mutateNormalVector3(this.layer.plane.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.plane.clampAnchor();

    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
    this.layer.focus = this.mutateUint8(this.layer.focus, this.SAMPLER_FOCUS, random.getFloat());
    this.layer.focusPower = this.mutateUint8(this.layer.focusPower, this.SAMPLER_FOCUS_POWER, random.getFloat());
};