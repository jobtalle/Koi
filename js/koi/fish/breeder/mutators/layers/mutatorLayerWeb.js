/**
 * Mutate a web layer in place
 * @param {LayerWeb} layer The web layer
 * @constructor
 */
const MutatorLayerWeb = function(layer) {
    MutatorLayer.call(this, layer);
};

MutatorLayerWeb.prototype = Object.create(MutatorLayer.prototype);
MutatorLayerWeb.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 4, 4);
MutatorLayerWeb.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, 3, 4);
MutatorLayerWeb.prototype.SAMPLER_SCALE = new SamplerPlateau(-11, 0, 11, .5);
MutatorLayerWeb.prototype.SAMPLER_THICKNESS = new SamplerPlateau(-25, 0, 25, 1.1);
MutatorLayerWeb.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-14, 0, 14, 1);

/**
 * Mutate the layer
 * @param {Number[]} otherColors The other palette indices for this pattern
 * @param {Random} random A randomizer
 */
MutatorLayerWeb.prototype.mutate = function(otherColors, random) {
    MutatorLayer.prototype.mutate.call(this, otherColors, random);

    this.mutateVector3(this.layer.plane.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.mutateNormalVector3(this.layer.plane.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.plane.clampAnchor();

    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.thickness = this.mutateUint8(this.layer.thickness, this.SAMPLER_THICKNESS, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
};