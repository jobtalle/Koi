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

/**
 * Breed the two given fish and produce offspring
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The pattern renderer
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Fish[]} An array of offspring
 */
Breeder.prototype.breed = function(atlas, patterns, randomSource, random) {
    const offspring = new Array(this.mother.body.getOffspringCount());

    for (let fish = 0, fishCount = offspring.length; fish < fishCount; ++fish) {
        const newFish = this.mixer.mix(patterns, random);

        new MutatorFish(newFish).mutate(random);

        atlas.write(newFish.body.pattern, randomSource);

        offspring[fish] = newFish;
    }

    return offspring;
};