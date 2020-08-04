/**
 * A fish body mutator that mutates a fish body in place
 * @param {FishBody} body The fish body
 * @constructor
 */
const MutatorFishBody = function(body) {
    this.body = body;
};

MutatorFishBody.prototype = Object.create(Mutator.prototype);
MutatorFishBody.prototype.SAMPLER_LENGTH = new SamplerPlateau(-40, 0, 40, 1.5);
MutatorFishBody.prototype.SAMPLER_RADIUS = new SamplerPlateau(-40, 0, 40, 1);

/**
 * Mutate the fish body
 * @param {Random} random A randomizer
 * @returns {FishBody} The mutated fish body
 */
MutatorFishBody.prototype.mutate = function(random) {
    this.body.length = this.mutateUint8(this.body.length, this.SAMPLER_LENGTH, random.getFloat());
    this.body.radius = this.mutateUint8(this.body.radius, this.SAMPLER_RADIUS, random.getFloat());

    return this.body;
};