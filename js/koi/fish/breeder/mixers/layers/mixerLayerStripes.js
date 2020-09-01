/**
 * Mix stripes layers
 * @param {LayerStripes} mother The mother layer
 * @param {LayerStripes} father The father layer
 * @constructor
 */
const MixerLayerStripes = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerLayerStripes.prototype = Object.create(Mixer.prototype);
MixerLayerStripes.prototype.SAMPLER_PALETTE = new SamplerSigmoid(0, 1, 15);
MixerLayerStripes.prototype.SAMPLER_SCALE = new SamplerSigmoid(0, 1, 6);
MixerLayerStripes.prototype.SAMPLER_DISTORTION = new SamplerSigmoid(0, 1, 5);
MixerLayerStripes.prototype.SAMPLER_ROUGHNESS = new SamplerSigmoid(0, 1, 3);
MixerLayerStripes.prototype.SAMPLER_THRESHOLD = new SamplerSigmoid(0, 1, 9);
MixerLayerStripes.prototype.SAMPLER_SLANT = new SamplerSigmoid(0, 1, 6);
MixerLayerStripes.prototype.SAMPLER_SUPPRESSION = new SamplerSigmoid(0, 1, 10);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerStripes} The mixed layer
 */
MixerLayerStripes.prototype.mix = function(random) {
    const interpolateSample = random.getFloat();

    return new LayerStripes(
        this.mother.plane.interpolate(this.father.plane, interpolateSample),
        this.mother.paletteSample.interpolate(
            this.father.paletteSample,
            this.SAMPLER_PALETTE.sample(random.getFloat())),
        this.mixUint8(this.mother.scale, this.father.scale, this.SAMPLER_SCALE, interpolateSample),
        this.mixUint8(this.mother.distortion, this.father.distortion, this.SAMPLER_DISTORTION, interpolateSample),
        this.mixUint8(this.mother.roughness, this.father.roughness, this.SAMPLER_ROUGHNESS, interpolateSample),
        this.mixUint8(this.mother.threshold, this.father.threshold, this.SAMPLER_THRESHOLD, interpolateSample),
        this.mixUint8(this.mother.slant, this.father.slant, this.SAMPLER_SLANT, interpolateSample),
        this.mixUint8(this.mother.suppression, this.father.suppression, this.SAMPLER_SUPPRESSION, interpolateSample));
}