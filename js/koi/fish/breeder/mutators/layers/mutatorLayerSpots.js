/**
 * Mutate a spots layer in place
 * @param {LayerSpots} layer The spots layer
 * @constructor
 */
const MutatorLayerSpots = function(layer) {
    this.layer = layer;
};

MutatorLayerSpots.prototype = Object.create(Mutator.prototype);
MutatorLayerSpots.prototype.SAMPLER_PALETTE_DISTANCE = new SamplerPower(0, 1.3, 8);
MutatorLayerSpots.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerPower(0, 2.5, 5);
MutatorLayerSpots.prototype.SAMPLER_X_DISTANCE = new SamplerPower(0, .4, 4);
MutatorLayerSpots.prototype.SAMPLER_SCALE = new SamplerPlateau(-7, 0, 7, 1);
MutatorLayerSpots.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-5, 0, 5, 1.5);
MutatorLayerSpots.prototype.SAMPLER_STRETCH = new SamplerPlateau(-8, 0, 8, 1);
MutatorLayerSpots.prototype.SAMPLER_X_FOCUS = new SamplerPlateau(-5, 0, 5, 3);
MutatorLayerSpots.prototype.SAMPLER_Y_FOCUS = new SamplerPlateau(-6, 0, 6, 3);
MutatorLayerSpots.prototype.SAMPLER_POWER = new SamplerPlateau(-9, 0, 9, 2.3);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerSpots.prototype.mutate = function(random) {
    this.mutatePalette(this.layer.paletteSample, this.SAMPLER_PALETTE_DISTANCE, random);
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