/**
 * A breeder that creates children from two parents
 * @param {Fish} mother The first parent, from which the children spawn
 * @param {Fish} father The second parent
 * @constructor
 */
const Breeder = function(mother, father) {
    this.mother = mother;
    this.father = father;

    this.mixerFish = new MixerFish(this.mother, this.father);
    this.mixerBody = new MixerBody(this.mother.body, this.father.body);
};

/**
 * Breed the two given fish and produce offspring
 * @param {Random} random A randomizer
 * @returns {Fish[]} An array of offspring
 */
Breeder.prototype.breed = function(random) {
    const offspring = new Array(this.mother.getOffspringCount());

    for (let fish = 0, fishCount = offspring.length; fish < fishCount; ++fish)
        offspring[fish] = this.mixerFish.mix(this.mixerBody, random);

    return offspring;
};