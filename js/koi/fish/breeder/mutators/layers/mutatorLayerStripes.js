/**
 * Mutate a stripes layer in place
 * @param {LayerStripes} layer The stripes layer
 * @constructor
 */
const MutatorLayerStripes = function(layer) {
    MutatorLayer.call(this, layer);
};

MutatorLayerStripes.prototype = Object.create(MutatorLayer.prototype);
MutatorLayerStripes.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 4, 5);
MutatorLayerStripes.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, .6, 4);
MutatorLayerStripes.prototype.SAMPLER_SCALE = new SamplerPlateau(-14, 0, 14, .3);
MutatorLayerStripes.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-12, 0, 12, .4);
MutatorLayerStripes.prototype.SAMPLER_SLANT = new SamplerPlateau(-10, 0, 10, .2);
MutatorLayerStripes.prototype.SAMPLER_ROUGHNESS = new SamplerPlateau(-11, 0, 11, .8);
MutatorLayerStripes.prototype.SAMPLER_DISTORTION = new SamplerPlateau(-11, 0, 11, .1);
MutatorLayerStripes.prototype.SAMPLER_SUPPRESSION = new SamplerPlateau(-13, 0, 13, .7);
MutatorLayerStripes.prototype.SAMPLER_FOCUS = new SamplerPlateau(-12, 0, 12, .8);
MutatorLayerStripes.prototype.SAMPLER_POWER = new SamplerPlateau(-13, 0, 13, .8);

/**
 * Mutate the layer
 * @param {Number[]} otherColors The other palette indices for this pattern
 * @param {Random} random A randomizer
 */
MutatorLayerStripes.prototype.mutate = function(otherColors, random) {
    MutatorLayer.prototype.mutate.call(this, otherColors, random);

    this.mutateVector3(this.layer.plane.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.mutateNormalVector3(this.layer.plane.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.plane.clampAnchor();

    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
    this.layer.slant = this.mutateUint8(this.layer.slant, this.SAMPLER_SLANT, random.getFloat());
    this.layer.roughness = this.mutateUint8(this.layer.roughness, this.SAMPLER_ROUGHNESS, random.getFloat());
    this.layer.distortion = this.mutateUint8(this.layer.distortion, this.SAMPLER_DISTORTION, random.getFloat());
    this.layer.suppression = this.mutateUint8(this.layer.suppression, this.SAMPLER_SUPPRESSION, random.getFloat());
    this.layer.focus = this.mutateUint8(this.layer.focus, this.SAMPLER_FOCUS, random.getFloat());
    this.layer.power = this.mutateUint8(this.layer.power, this.SAMPLER_POWER, random.getFloat());
};