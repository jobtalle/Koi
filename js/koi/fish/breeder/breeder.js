/**
 * A breeder that creates children from two parents
 * @param {Fish} mother The first parent, from which the children spawn
 * @param {Fish} father The second parent
 * @constructor
 */
const Breeder = function(mother, father) {
    this.mother = mother;
    this.father = father;

    this.mixer = new MixerFish(this.mother, this.father);
};

Breeder.prototype.BREED_OVERHEAD = 20;
Breeder.prototype

/**
 * Breed the two given fish and produce offspring
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The pattern renderer
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Fish[]} An array of offspring
 */
Breeder.prototype.breed = function(atlas, patterns, randomSource, random) {
    const offspring = new Array(this.mother.getOffspringCount());

    for (let fish = 0, fishCount = offspring.length; fish < fishCount; ++fish) {
        const newFish = this.mixer.mix(atlas, patterns, randomSource, random);

        new MutatorFish(newFish).mutate(random);

        offspring[fish] = newFish;
    }

    return offspring;
};