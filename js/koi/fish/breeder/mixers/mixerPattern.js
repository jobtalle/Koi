/**
 * Mix fish patterns
 * @param {Pattern} mother The first fish pattern
 * @param {Pattern} father The second fish pattern
 * @constructor
 */
const MixerPattern = function(mother, father) {

};

MixerPattern.prototype = Object.create(Mixer.prototype);

/**
 * Create a new pattern that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Pattern} The mixed pattern
 */
MixerPattern.prototype.mix = function(random) {

};