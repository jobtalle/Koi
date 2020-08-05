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
MixerLayerSpots.prototype.SAMPLER_SCALE = new SamplerSigmoid(0, 1, 15);
MixerLayerSpots.prototype.SAMPLER_SAMPLE = new SamplerSigmoid(0, 1, 33);
MixerLayerSpots.prototype.SAMPLER_PALETTE = new SamplerSigmoid(0, 1, 15);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerSpots} The mixed layer
 */
MixerLayerSpots.prototype.mix = function(random) {
    const interpolateSample = this.SAMPLER_SAMPLE.sample(random.getFloat());
    const interpolatePalette = this.SAMPLER_PALETTE.sample(random.getFloat());

    return new LayerSpots(
        this.mixUint8(this.mother.scale, this.father.scale, this.SAMPLER_SCALE, interpolateSample),
        this.mother.paletteSample.interpolate(this.father.paletteSample, interpolatePalette),
        this.mother.anchor.interpolate(this.father.anchor, interpolateSample),
        this.mother.x.interpolate(this.father.x, interpolateSample).normalize());
};