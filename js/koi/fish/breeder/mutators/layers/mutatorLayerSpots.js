/**
 * Mutate a spots layer in place
 * @param {LayerSpots} layer The spots layer
 * @constructor
 */
const MutatorLayerSpots = function(layer) {
    this.layer = layer;
};

MutatorLayerSpots.prototype = Object.create(Mutator.prototype);
MutatorLayerSpots.prototype.SAMPLER_PALETTE_DISTANCE = new SamplerQuadratic(0, 3, 8);
MutatorLayerSpots.prototype.SAMPLER_ANCHOR_DISTANCE = new SamplerQuadratic(0, .7, 3);
MutatorLayerSpots.prototype.SAMPLER_X_DISTANCE = new SamplerQuadratic(0, .5, 4);
MutatorLayerSpots.prototype.SAMPLER_SCALE = new SamplerPlateau(-7, 0, 7, 1);
MutatorLayerSpots.prototype.SAMPLER_THRESHOLD = new SamplerPlateau(-5, 0, 5, 1.5);
MutatorLayerSpots.prototype.SAMPLER_STRETCH = new SamplerPlateau(-8, 0, 8, 1);

/**
 * Mutate the layer
 * @param {Random} random A randomizer
 */
MutatorLayerSpots.prototype.mutate = function(random) {
    this.mutatePalette(this.layer.paletteSample, this.SAMPLER_PALETTE_DISTANCE, random);
    this.mutateVector3(this.layer.anchor, this.SAMPLER_ANCHOR_DISTANCE, random);
    this.clampVector3(this.layer.anchor, this.layer.SPACE_LIMIT_MIN, this.layer.SPACE_LIMIT_MAX);
    this.mutateNormalVector3(this.layer.x, this.SAMPLER_X_DISTANCE, random);

    this.layer.scale = this.mutateUint8(this.layer.scale, this.SAMPLER_SCALE, random.getFloat());
    this.layer.threshold = this.mutateUint8(this.layer.threshold, this.SAMPLER_THRESHOLD, random.getFloat());
    this.layer.stretch = this.mutateUint8(this.layer.stretch, this.SAMPLER_STRETCH, random.getFloat());
};