/**
 * Mix tail properties
 * @param {Tail} mother The mother tail
 * @param {Tail} father The father tail
 * @constructor
 */
const MixerTail = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerTail.prototype = Object.create(Mixer.prototype);

/**
 * Create a new tail that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Tail} The mixed tail
 */
MixerTail.prototype.mix = function(random) {

};