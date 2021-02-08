/**
 * Mutate a spots layer in place
 * @param {LayerSpots} layer The spots layer
 * @constructor
 */
const MutatorLayerSpots = function(layer) {
    MutatorLayer.call(this, layer);
};

MutatorLayerSpots.prototype = Object.create(MutatorLayer.prototype);
MutatorLayerSpots.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 2.5, 5);
MutatorLayerSpots.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, 2, 4);
MutatorLayerSpots.prototype.SAMPLER_SCALE = new SamplerPlateau(-11, 0, 11, .6);
MutatorLayerSpots.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-20, 0, 20, 1);
MutatorLayerSpots.prototype.SAMPLER_STRETCH = new SamplerPlateau(-13, 0, 13, .7);
MutatorLayerSpots.prototype.SAMPLER_X_FOCUS = new SamplerPlateau(-11, 0, 11, .3);
MutatorLayerSpots.prototype.SAMPLER_Y_FOCUS = new SamplerPlateau(-11, 0, 11, .3);
MutatorLayerSpots.prototype.SAMPLER_POWER = new SamplerPlateau(-10, 0, 10, .8);

/**
 * Mutate the layer
 * @param {Number[]} otherColors The other palette indices for this pattern
 * @param {Random} random A randomizer
 */
MutatorLayerSpots.prototype.mutate = function(otherColors, random) {
    MutatorLayer.prototype.mutate.call(this, otherColors, random);

    this.mutateVector3(this.layer.plane.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.mutateNormalVector3(this.layer.plane.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.plane.clampAnchor();

    this.layer.stretch = this.mutateUint8(this.layer.stretch, this.SAMPLER_STRETCH, random.getFloat());
    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
    this.layer.xFocus = this.mutateUint8(this.layer.xFocus, this.SAMPLER_X_FOCUS, random.getFloat());
    this.layer.yFocus = this.mutateUint8(this.layer.yFocus, this.SAMPLER_Y_FOCUS, random.getFloat());
    this.layer.power = this.mutateUint8(this.layer.power, this.SAMPLER_POWER, random.getFloat());
};