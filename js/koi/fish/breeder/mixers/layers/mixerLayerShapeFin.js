/**
 * Mix fin shape layers
 * @param {LayerShapeFin} mother The mother layer
 * @param {LayerShapeFin} father The father layer
 * @constructor
 */
const MixerLayerShapeFin = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerLayerShapeFin.prototype = Object.create(Mixer.prototype);
MixerLayerShapeFin.prototype.SAMPLER_ROUNDNESS = new SamplerSigmoid(0, 1, 15);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerShapeFin} The mixed layer
 */
MixerLayerShapeFin.prototype.mix = function(random) {
    return new LayerShapeFin(
        this.mixUint8(this.mother.roundness, this.father.roundness, this.SAMPLER_ROUNDNESS, random.getFloat()));
};