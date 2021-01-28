/**
 * A fish body mutator that mutates a fish body in place
 * @param {FishBody} body The fish body
 * @constructor
 */
const MutatorFishBody = function(body) {
    this.body = body;

    this.mutatorPattern = new MutatorPattern(body.pattern);
    this.mutatorFins = new MutatorFins(body.fins);
    this.mutatorTail = new MutatorTail(body.tail);
};

MutatorFishBody.prototype = Object.create(Mutator.prototype);
MutatorFishBody.prototype.SAMPLER_LENGTH = new SamplerPlateau(-18, 0, 18, .5);
MutatorFishBody.prototype.SAMPLER_RADIUS = new SamplerPlateau(-18, 0, 18, .3);
MutatorFishBody.prototype.SAMPLER_GROWTH_SPEED = new SamplerPlateau(-14, 0, 14, .5);
MutatorFishBody.prototype.SAMPLER_MATING_FREQUENCY = new SamplerPlateau(-12, 0, 12, .5);
MutatorFishBody.prototype.SAMPLER_OFFSPRING_COUNT = new SamplerPlateau(-34, 0, 34, .1);

/**
 * Mutate the fish body
 * @param {Random} random A randomizer
 */
MutatorFishBody.prototype.mutate = function(random) {
    this.body.length = this.mutateUint8(this.body.length, this.SAMPLER_LENGTH, random.getFloat());
    this.body.radius = this.mutateUint8(this.body.radius, this.SAMPLER_RADIUS, random.getFloat());
    this.body.growthSpeed = this.mutateUint8(
        this.body.growthSpeed,
        this.SAMPLER_GROWTH_SPEED,
        random.getFloat());
    this.body.matingFrequency = this.mutateUint8(
        this.body.matingFrequency,
        this.SAMPLER_MATING_FREQUENCY,
        random.getFloat());
    this.body.offspringCount = this.mutateUint8(
        this.body.offspringCount,
        this.SAMPLER_OFFSPRING_COUNT,
        random.getFloat());

    this.mutatorPattern.mutate(random);
    this.mutatorFins.mutate(random);
    this.mutatorTail.mutate(random);
};