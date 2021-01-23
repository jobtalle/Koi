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
MixerLayerShapeFin.prototype.SAMPLER_ANGLE = new SamplerSigmoid(0, 1, 14);
MixerLayerShapeFin.prototype.SAMPLER_INSET = new SamplerSigmoid(0, 1, 5);
MixerLayerShapeFin.prototype.SAMPLER_DIPS = new SamplerSigmoid(0, 1, 10);
MixerLayerShapeFin.prototype.SAMPLER_DIP_POWER = new SamplerSigmoid(0, 1, 13);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerShapeFin} The mixed layer
 */
MixerLayerShapeFin.prototype.mix = function(random) {
    const interpolate = random.getFloat();

    return new LayerShapeFin(
        this.mixUint8(this.mother.angle, this.father.angle, this.SAMPLER_ANGLE, interpolate),
        this.mixUint8(this.mother.inset, this.father.inset, this.SAMPLER_INSET, interpolate),
        this.mixUint8(this.mother.dips, this.father.dips, this.SAMPLER_DIPS, interpolate),
        this.mixUint8(this.mother.dipPower, this.father.dipPower, this.SAMPLER_DIP_POWER, interpolate));
};