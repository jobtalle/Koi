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
MixerLayerSpots.prototype.SAMPLER_BLEND_SCALE = new SamplerSigmoid(0, 1, 26);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerSpots} The mixed layer
 */
MixerLayerSpots.prototype.mix = function(random) {
    const interpolate = this.SAMPLER_BLEND_SCALE.sample(random.getFloat());

    return new LayerSpots(
        this.mother.scale + (this.father.scale - this.mother.scale) * interpolate,
        this.mother.paletteSample.interpolate(this.father.paletteSample, interpolate),
        this.mother.anchor.interpolate(this.father.anchor, interpolate),
        this.mother.x.interpolate(this.father.x, interpolate).normalize());
};

/**
 * Mutate the properties of a layer in place
 * @param {Layer} layer The layer
 * @param {Random} random A randomizer
 * @returns {Layer} The mutated layer
 */
MixerLayerSpots.mutate = function(layer, random) {
    return layer; // TODO: Mutate here
};