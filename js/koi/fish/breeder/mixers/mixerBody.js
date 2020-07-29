/**
 * Mix body properties
 * @param {FishBody} mother The first fish body
 * @param {FishBody} father The second fish body
 * @constructor
 */
const MixerBody = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerBody.prototype = Object.create(Mixer.prototype);

/**
 * Create a new body that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {FishBody} The mixed body
 */
MixerBody.prototype.mix = function(random) {

};