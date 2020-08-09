/**
 * Mix body shape layers
 * @param {LayerShapeBody} mother The mother layer
 * @param {LayerShapeBody} father The father layer
 * @constructor
 */
const MixerLayerShapeBody = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerLayerShapeBody.prototype = Object.create(Mixer.prototype);
MixerLayerShapeBody.prototype.SAMPLER_CENTER_POWER = new SamplerSigmoid(0, 1, 20);
MixerLayerShapeBody.prototype.SAMPLER_RADIUS_POWER = MixerLayerShapeBody.prototype.SAMPLER_CENTER_POWER;

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerShapeBody} The mixed layer
 */
MixerLayerShapeBody.prototype.mix = function(random) {
    const interpolate = random.getFloat();

    return new LayerShapeBody(
        this.mixUint8(this.mother.centerPower, this.father.centerPower, this.SAMPLER_CENTER_POWER, interpolate),
        this.mixUint8(this.mother.radiusPower, this.father.radiusPower, this.SAMPLER_RADIUS_POWER, interpolate));
};