/**
 * Mix body properties
 * @param {FishBody} mother The first fish body
 * @param {FishBody} father The second fish body
 * @constructor
 */
const MixerFishBody = function(mother, father) {
    this.mother = mother;
    this.father = father;

    this.mixerPattern = new MixerPattern(mother.pattern, father.pattern);
    this.mixerFins = new MixerFins(mother.fins, father.fins);
    this.mixerTail = new MixerTail(mother.tail, father.tail);
};

MixerFishBody.prototype = Object.create(Mixer.prototype);
MixerFishBody.prototype.SAMPLER_LENGTH = new SamplerPlateau(0, .4, 1, .5);
MixerFishBody.prototype.SAMPLER_RADIUS = MixerFishBody.prototype.SAMPLER_LENGTH;

/**
 * Create a new body that combines properties from both parents
 * @param {Patterns} patterns The pattern renderer
 * @param {Random} random A randomizer
 * @returns {FishBody} The mixed body
 */
MixerFishBody.prototype.mix = function(patterns, random) {
    return new FishBody(
        this.mixerPattern.mix(patterns, random),
        this.mixerFins.mix(random),
        this.mixerTail.mix(random),
        this.mixUint8Ordered(
            this.mother.length,
            this.father.length,
            this.SAMPLER_LENGTH,
            random.getFloat()),
        this.mixUint8Ordered(
            this.mother.radius,
            this.father.radius,
            this.SAMPLER_RADIUS,
            random.getFloat()));
};