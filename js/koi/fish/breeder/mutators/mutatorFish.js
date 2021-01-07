/**
 * A fish mutator that mutates a fish in place
 * @param {Fish} fish A fish
 * @constructor
 */
const MutatorFish = function(fish) {
    this.fish = fish;

    this.mutatorBody = new MutatorFishBody(fish.body);
};

MutatorFish.prototype = Object.create(Mutator.prototype);

/**
 * Mutate the fish
 * @param {Random} random A randomizer
 */
MutatorFish.prototype.mutate = function(random) {
    this.mutatorBody.mutate(random);
};