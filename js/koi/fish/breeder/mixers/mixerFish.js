/**
 * Mix fish properties
 * @param {Fish} mother The first fish
 * @param {Fish} father The second fish
 * @constructor
 */
const MixerFish = function(mother, father) {
    this.mother = mother;
    this.father = father;
};

MixerFish.prototype = Object.create(Mixer.prototype);
MixerFish.prototype.SAMPLER_MUTATE_GROWTH_SPEED = new SamplerPlateau(-2, 0, 2, 1.5);
MixerFish.prototype.SAMPLER_MUTATE_MATING_FREQUENCY = new SamplerPlateau(-2, 0, 2, .5);
MixerFish.prototype.SAMPLER_MUTATE_OFFSPRING_COUNT = new SamplerPlateau(-1, 0, 1, 1);

/**
 * Create a new fish that combines properties from both parents
 * @param {MixerBody} mixBody A body mixer
 * @param {Random} random A randomizer
 * @returns {Fish} The mixed fish
 */
MixerFish.prototype.mix = function(mixBody, random) {
    return new Fish(
        mixBody.mix(random),
        this.mother.position.copy(),
        new Vector2().fromAngle(random.getFloat() * Math.PI * 2),
        this.mixUint8Average(
            this.mother.growthSpeed,
            this.father.growthSpeed,
            this.SAMPLER_MUTATE_GROWTH_SPEED,
            random),
        this.mixUint8Average(
            this.mother.matingFrequency,
            this.father.matingFrequency,
            this.SAMPLER_MUTATE_MATING_FREQUENCY,
            random),
        this.mixUint8Average(
            this.mother.offspringCount,
            this.father.offspringCount,
            this.SAMPLER_MUTATE_OFFSPRING_COUNT,
            random));
};