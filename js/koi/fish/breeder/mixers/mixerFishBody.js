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
MixerFishBody.prototype.SAMPLER_LENGTH = new SamplerPower(0, 1, 1.5);
MixerFishBody.prototype.SAMPLER_RADIUS = MixerFishBody.prototype.SAMPLER_LENGTH;
MixerFishBody.prototype.SAMPLER_GROWTH_SPEED = new Sampler(0, 1);
MixerFishBody.prototype.SAMPLER_MATING_FREQUENCY = new SamplerPower(0, 1, 3);
MixerFishBody.prototype.SAMPLER_OFFSPRING_COUNT = new SamplerPower(0, 1, 4);

/**
 * Create a new body that combines properties from both parents
 * @param {Patterns} patterns The pattern renderer
 * @param {Mutations} mutations The mutations object
 * @param {Boolean} forceMutation True if at least one mutation must occur when possible during breeding
 * @param {Function} onMutate A function that is called when a pattern mutation occurs
 * @param {Random} random A randomizer
 * @returns {FishBody} The mixed body
 */
MixerFishBody.prototype.mix = function(
    patterns,
    mutations,
    forceMutation,
    onMutate,
    random) {
    const interpolation = random.getFloat();

    return new FishBody(
        this.mixerPattern.mix(patterns, mutations, forceMutation, onMutate, random),
        this.mixerFins.mix(random),
        this.mixerTail.mix(random),
        this.mixUint8(
            this.mother.length,
            this.father.length,
            this.SAMPLER_LENGTH,
            interpolation),
        this.mixUint8(
            this.mother.radius,
            this.father.radius,
            this.SAMPLER_RADIUS,
            interpolation),
        this.mixUint8(
            this.mother.growthSpeed,
            this.father.growthSpeed,
            this.SAMPLER_GROWTH_SPEED,
            random.getFloat()),
        this.mixUint8Ordered(
            this.mother.matingFrequency,
            this.father.matingFrequency,
            this.SAMPLER_MATING_FREQUENCY,
            random.getFloat()),
        this.mixUint8Ordered(
            this.mother.offspringCount,
            this.father.offspringCount,
            this.SAMPLER_OFFSPRING_COUNT,
            random.getFloat()));
};