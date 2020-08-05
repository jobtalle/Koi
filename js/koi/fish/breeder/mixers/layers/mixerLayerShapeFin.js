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

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerShapeFin} The mixed layer
 */
MixerLayerShapeFin.prototype.mix = function(random) { // TODO: Mix
    return new LayerShapeFin();
};