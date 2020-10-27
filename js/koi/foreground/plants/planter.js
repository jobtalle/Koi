/**
 * A planter that places plant species in slots according to a biome
 * @param {Slots} slots The slots to fill
 * @param {Biome} biome The biome
 * @param {PlantMap} plantMap A plant map to populate
 * @param {Random} random The randomizer
 * @constructor
 */
const Planter = function(slots, biome, plantMap, random) {
    slots.sort();

    this.slots = slots;
    this.biome = biome;
    this.plantMap = plantMap;
    this.random = random;
};

Planter.prototype.BEACH_MAX = .1;
Planter.prototype.CATTAIL_CHANCE = .2;
Planter.prototype.CATTAIL_DIST_MIN = .2;
Planter.prototype.CATTAIL_DIST_MAX = 1.1;

/**
 * Get the cattail factor
 * @param {Number} waterDistance The distance to the nearest body of water
 * @param {Number} beachFactor The beach factor
 * @returns {Number} The cattail chance
 */
Planter.prototype.getCattailFactor = function(waterDistance, beachFactor) {
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
        const minRocks = Math.min(
            this.biome.sampleRocksPonds(slot.x, slot.y),
            this.biome.sampleRocksRiver(slot.x, slot.y));
        const beachFactor = Math.max(0, Math.min(1, -minRocks / this.BEACH_MAX));

        const cattailFactor = this.getCattailFactor(waterDistance, beachFactor);

        if (this.random.getFloat() < cattailFactor * this.CATTAIL_CHANCE)
            plants.modelCattail(slot.x, slot.y, cattailFactor, this.random, vertices, indices);
        else
            plants.modelGrass(
                slot.x,
                slot.y,
                minRocks,
                this.random,
                vertices,
                indices);

        this.plantMap.add(slot.x, slot.y);
    }

    this.plantMap.toDensity();
};