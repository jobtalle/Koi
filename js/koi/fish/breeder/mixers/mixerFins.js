/**
 * Mix two fin sets
 * @param {Fins} mother The mother fins
 * @param {Fins} father The father fins
 * @constructor
 */
const MixerFins = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerFins.prototype = Object.create(Mixer.prototype);

/**
 * Create a new set of fins that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Fins} The mixed fins
 */
MixerFins.prototype.mix = function(random) {
    return new Fins(
        new MixerFin(this.mother.front, this.father.front).mix(random),
        new MixerFin(this.mother.back, this.father.back).mix(random));
};