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
MixerLayerSpots.prototype.SAMPLER_PLANE = new SamplerSigmoid(0, 1, 16);
MixerLayerSpots.prototype.SAMPLER_SCALE = new SamplerSigmoid(0, 1, 15);
MixerLayerSpots.prototype.SAMPLER_STRETCH = new SamplerSigmoid(0, 1, 5);
MixerLayerSpots.prototype.SAMPLER_THRESHOLD = new SamplerSigmoid(0, 1, 2);
MixerLayerSpots.prototype.SAMPLER_PALETTE = new SamplerSigmoid(0, 1, 15);
MixerLayerSpots.prototype.SAMPLER_FOCUS = new Sampler(0, 1);
MixerLayerSpots.prototype.SAMPLER_POWER = new SamplerSigmoid(0, 1, 4);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerSpots} The mixed layer
 */
MixerLayerSpots.prototype.mix = function(random) {
    const interpolateSample = random.getFloat();

    return new LayerSpots(
        this.mother.plane.interpolate(this.father.plane, this.SAMPLER_PLANE.sample(interpolateSample)),
        interpolateSample < .5 ? this.mother.paletteIndex : this.father.paletteIndex,
        this.mixUint8(this.mother.scale, this.father.scale, this.SAMPLER_SCALE, interpolateSample),
        this.mixUint8(this.mother.stretch, this.father.stretch, this.SAMPLER_STRETCH, interpolateSample),
        this.mixUint8(this.mother.threshold, this.father.threshold, this.SAMPLER_THRESHOLD, interpolateSample),
        this.mixUint8(this.mother.xFocus, this.father.xFocus, this.SAMPLER_FOCUS, interpolateSample),
        this.mixUint8(this.mother.yFocus, this.father.yFocus, this.SAMPLER_FOCUS, interpolateSample),
        this.mixUint8(this.mother.power, this.father.power, this.SAMPLER_POWER, interpolateSample));
};