/**
 * Mix ridge layers
 * @param {LayerRidge} mother The mother layer
 * @param {LayerRidge} father The father layer
 * @constructor
 */
const MixerLayerRidge = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerLayerRidge.prototype = Object.create(Mixer.prototype);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerRidge} The mixed layer
 */
MixerLayerRidge.prototype.mix = function(random) {
    return this.mother.copy(); // TODO
};