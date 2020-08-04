/**
 * Mix fish properties
 * @param {Fish} mother The first fish
 * @param {Fish} father The second fish
 * @constructor
 */
const MixerFish = function(mother, father) {
    this.mother = mother;
    this.father = father;

    this.mixerBody = new MixerFishBody(mother.body, father.body);
};

MixerFish.prototype = Object.create(Mixer.prototype);
MixerFish.prototype.SAMPLER_GROWTH_SPEED = new Sampler(0, 1);
MixerFish.prototype.SAMPLER_MATING_FREQUENCY = new SamplerQuadratic(0, 1, 3);
MixerFish.prototype.SAMPLER_OFFSPRING_COUNT = new SamplerQuadratic(0, 1, 4);

/**
 * Create a new fish that combines properties from both parents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Fish} The mixed fish
 */
MixerFish.prototype.mix = function(atlas, randomSource, random) {
    return new Fish(
        this.mixerBody.mix(atlas, randomSource, random),
        this.mother.position.copy(),
        new Vector2().fromAngle(random.getFloat() * Math.PI * 2),
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