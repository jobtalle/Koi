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

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerShapeBody} The mixed layer
 */
MixerLayerShapeBody.prototype.mix = function(random) { // TODO: Mix
    return new LayerShapeBody(
        this.mother.centerPower,
        this.mother.radiusPower);
};