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

Planter.prototype.BEACH_MAX = .18;
Planter.prototype.CATTAIL_CHANCE = .13;
Planter.prototype.CATTAIL_DIST_MIN = .2;
Planter.prototype.CATTAIL_DIST_MAX = 1.5;

/**
 * Get the cattail chance
 * @param {Number} waterDistance The distance to the nearest body of water
 * @param {Number} beachFactor The beach factor
 * @returns {Number} The cattail chance
 */
Planter.prototype.getCattailChance = function(waterDistance, beachFactor) {
    return beachFactor * (1 - Math.max(
        0,
        Math.min(
            1,
            (waterDistance - this.CATTAIL_DIST_MIN) / (this.CATTAIL_DIST_MAX - this.CATTAIL_DIST_MIN))));
};

/**
 * Plant all plants into slots
 * @param {Plants} plants The plants object
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 */
Planter.prototype.plant = function(plants, vertices, indices) {
    for (const slot of this.slots.slots) if (slot) {
        const waterDistance = this.biome.sampleSDF(slot.x, slot.y);
        const beachFactor = Math.max(0, Math.min(1, -Math.min(
            this.biome.sampleRocksPonds(slot.x, slot.y),
            this.biome.sampleRocksRiver(slot.x, slot.y)) / this.BEACH_MAX));

        const cattailFactor = this.getCattailChance(waterDistance, beachFactor);

        if (this.random.getFloat() < cattailFactor * this.CATTAIL_CHANCE)
            plants.modelCattail(slot.x, slot.y, cattailFactor, this.random, vertices, indices);
        else
            plants.modelGrass(slot.x, slot.y, this.random, vertices, indices);
    }
};