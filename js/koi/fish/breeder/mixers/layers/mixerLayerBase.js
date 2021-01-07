/**
 * Mix base layers
 * @param {LayerBase} mother The mother layer
 * @param {LayerBase} father The father layer
 * @constructor
 */
const MixerLayerBase = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerLayerBase.prototype = Object.create(Mixer.prototype);

/**
 * Create a new layer that mixes the properties from both parents
 * @param {Random} random A randomizer
 * @returns {LayerBase} The mixed layer
 */
MixerLayerBase.prototype.mix = function(random) {
    return new LayerBase(
        random.getFloat() < .5 ? this.mother.paletteIndex : this.father.paletteIndex);
};