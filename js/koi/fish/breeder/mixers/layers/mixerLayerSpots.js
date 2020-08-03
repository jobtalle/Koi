/**
 * Mix spots layers
 * @param {LayerSpots} mother The mother layer
 * @param {LayerSpots} father The father layer
 * @constructor
 */
const MixerLayerSpots = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerLayerSpots.prototype = Object.create(Mixer.prototype);
MixerLayerSpots.prototype.SAMPLER_BLEND_SAMPLE = new SamplerSigmoid(0, 1, 33);
MixerLayerSpots.prototype.SAMPLER_BLEND_PALETTE = new SamplerSigmoid(0, 1, 15);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerSpots} The mixed layer
 */
MixerLayerSpots.prototype.mix = function(random) {
    const interpolateSample = this.SAMPLER_BLEND_SAMPLE.sample(random.getFloat());
    const interpolatePalette = this.SAMPLER_BLEND_PALETTE.sample(random.getFloat());

    return new LayerSpots(
        this.mother.scale + (this.father.scale - this.mother.scale) * interpolateSample,
        this.mother.paletteSample.interpolate(this.father.paletteSample, interpolatePalette),
        this.mother.anchor.interpolate(this.father.anchor, interpolateSample),
        this.mother.x.interpolate(this.father.x, interpolateSample).normalize());
};

/**
 * Mutate the properties of a layer in place
 * @param {LayerSpots} layer The layer
 * @param {Random} random A randomizer
 * @returns {LayerSpots} The mutated layer
 */
MixerLayerSpots.mutate = function(layer, random) {
    return layer; // TODO: Mutate here
};