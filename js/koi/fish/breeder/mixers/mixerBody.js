/**
 * Mix body properties
 * @param {FishBody} mother The first fish body
 * @param {FishBody} father The second fish body
 * @constructor
 */
const MixerBody = function(mother, father) {
    this.mother = mother;
    this.father = father;

    this.mixerPattern = new MixerPattern(mother.pattern, father.pattern);
    this.mixerFins = new MixerFins(mother.fins, father.fins);
    this.mixerTail = new MixerTail(mother.tail, father.tail);
};

MixerBody.prototype = Object.create(Mixer.prototype);
MixerBody.prototype.SAMPLER_BLEND_LENGTH = new SamplerPlateau(0, .4, 1, .5);
MixerBody.prototype.SAMPLER_BLEND_RADIUS = MixerBody.prototype.SAMPLER_BLEND_LENGTH;
MixerBody.prototype.SAMPLER_MUTATE_LENGTH = new SamplerPlateau(-1.5, 0, 1.5, 0);
MixerBody.prototype.SAMPLER_MUTATE_RADIUS = MixerBody.prototype.SAMPLER_MUTATE_LENGTH;

/**
 * Create a new body that combines properties from both parents
 * @param {Random} random A randomizer
 * @returns {FishBody} The mixed body
 */
MixerBody.prototype.mix = function(random) {
    return new FishBody(
        this.mixerPattern.mix(random),
        this.mixerFins.mix(random),
        this.mixerTail.mix(random),
        this.mixUint8Blend(
            this.mother.length,
            this.father.length,
            this.SAMPLER_BLEND_LENGTH,
            this.SAMPLER_MUTATE_LENGTH,
            random),
        this.mixUint8Blend(
            this.mother.radius,
            this.father.radius,
            this.SAMPLER_BLEND_RADIUS,
            this.SAMPLER_MUTATE_RADIUS,
            random));
};