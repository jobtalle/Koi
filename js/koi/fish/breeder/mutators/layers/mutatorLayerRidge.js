/**
 * Mutate a ridge layer in place
 * @param {LayerRidge} layer The ridge layer
 * @constructor
 */
const MutatorLayerRidge = function(layer) {
    MutatorLayer.call(this, layer);
};

MutatorLayerRidge.prototype = Object.create(MutatorLayer.prototype);
MutatorLayerRidge.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 3, 4);
MutatorLayerRidge.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, .6, 4);
MutatorLayerRidge.prototype.SAMPLER_SCALE = new SamplerPlateau(-11, 0, 11, .5);
MutatorLayerRidge.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-14, 0, 14, .8);
MutatorLayerRidge.prototype.SAMPLER_FOCUS = new SamplerPlateau(-13, 0, 13, .9);
MutatorLayerRidge.prototype.SAMPLER_FOCUS_POWER = new SamplerPlateau(-12, 0, 12, .5);

/**
 * Mutate the layer
 * @param {Number[]} otherColors The other palette indices for this pattern
 * @param {Random} random A randomizer
 */
MutatorLayerRidge.prototype.mutate = function(otherColors, random) {
    MutatorLayer.prototype.mutate.call(this, otherColors, random);

    this.mutateVector3(this.layer.plane.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.mutateNormalVector3(this.layer.plane.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.plane.clampAnchor();

    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
    this.layer.focus = this.mutateUint8(this.layer.focus, this.SAMPLER_FOCUS, random.getFloat());
    this.layer.focusPower = this.mutateUint8(this.layer.focusPower, this.SAMPLER_FOCUS_POWER, random.getFloat());
};