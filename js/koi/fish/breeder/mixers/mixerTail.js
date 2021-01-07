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
MixerTail.prototype.SAMPLER_LENGTH = new Sampler(0, 1);
MixerTail.prototype.SAMPLER_SKEW = new Sampler(0, 1);

/**
 * Create a new tail that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {Tail} The mixed tail
 */
MixerTail.prototype.mix = function(random) {
    const interpolate = random.getFloat();

    return new Tail(
        this.mixUint8(this.mother.length, this.father.length, this.SAMPLER_LENGTH, interpolate),
        this.mixUint8(this.mother.skew, this.father.skew, this.SAMPLER_SKEW, interpolate));
};