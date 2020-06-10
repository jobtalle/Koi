/**
 * A planter that places plant species in slots according to a biome
 * @param {Slots} slots The slots to fill
 * @param {Biome} biome The biome
 * @param {Random} random The randomizer
 * @constructor
 */
const Planter = function(slots, biome, random) {
    slots.sort();

    this.slots = slots;
    this.biome = biome;
    this.random = random;
};

/**
 * Plant all plants into slots
 * @param {Plants} plants The plants object
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Planter.prototype.plant = function(plants, vertices, indices) {
    for (const slot of this.slots.slots) if (slot) {
        if (this.biome.sampleSDF(slot.x, slot.y) < .5)
            plants.modelCattail(slot.x, slot.y, this.random, vertices, indices);
        else
            plants.modelGrass(slot.x, slot.y, this.random, vertices, indices);
    }
};