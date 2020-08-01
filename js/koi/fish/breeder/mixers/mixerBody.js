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
MixerBody.prototype.SAMPLER_MUTATE_LENGTH = new SamplerPlateau(-40, 0, 40, 1.5);
MixerBody.prototype.SAMPLER_MUTATE_RADIUS = new SamplerPlateau(-40, 0, 40, 1);

/**
 * Create a new body that combines properties from both parents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {FishBody} The mixed body
 */
MixerBody.prototype.mix = function(atlas, randomSource, random) {
    return new FishBody(
        this.mixerPattern.mix(atlas, randomSource, random),
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