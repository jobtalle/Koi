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
MutatorFishBody.prototype.SAMPLER_LENGTH = new SamplerPlateau(-15, 0, 15, 1.5);
MutatorFishBody.prototype.SAMPLER_RADIUS = new SamplerPlateau(-15, 0, 15, 1);
MutatorFishBody.prototype.SAMPLER_GROWTH_SPEED = new SamplerPlateau(-3, 0, 3, 1.5);
MutatorFishBody.prototype.SAMPLER_MATING_FREQUENCY = new SamplerPlateau(-5, 0, 5, .5);
MutatorFishBody.prototype.SAMPLER_OFFSPRING_COUNT = new SamplerPlateau(-15, 0, 15, 1);

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