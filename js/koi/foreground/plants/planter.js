/**
 * A planter that places plant species in slots according to a biome
 * @param {Slots} slots The slots to fill
 * @param {HiddenSlots} hiddenSlots The hidden slots
 * @param {Biome} biome The biome
 * @param {PlantMap} plantMap A plant map to populate
 * @param {Random} random The randomizer
 * @constructor
 */
const Planter = function(slots, hiddenSlots, biome, plantMap, random) {
    slots.sort();

    this.slots = slots;
    this.hiddenSlots = hiddenSlots;
    this.biome = biome;
    this.plantMap = plantMap;
    this.random = random;
};

Planter.prototype.EPSILON = .05;
Planter.prototype.BEACH_MAX = .1;
Planter.prototype.GRASS_CLEARANCE = .1;
Planter.prototype.CATTAIL_CHANCE = .15;
Planter.prototype.CATTAIL_CHANCE_RAMP = 10;
Planter.prototype.CATTAIL_DIST_MIN = .1;
Planter.prototype.CATTAIL_DIST_MAX = 1.3;
Planter.prototype.SHRUBBERY_DIST_MIN = .9;
Planter.prototype.SHRUBBERY_DIST_MAX = 2;
Planter.prototype.SHRUBBERY_DENSITY = .64;
Planter.prototype.SHRUBBERY_HIDDEN_SIZE = new SamplerPower(.7, 1, 2);

/**
 * Get the cattail factor
 * @param {Number} shoreDistance The distance to the nearest body of water
 * @param {Number} beachFactor The beach factor
 * @returns {Number} The cattail factor
 */
Planter.prototype.getCattailFactor = function(shoreDistance, beachFactor) {
    const distance = Math.min(
        1,
        Math.max(
            0,
            shoreDistance - this.CATTAIL_DIST_MIN) / (this.CATTAIL_DIST_MAX - this.CATTAIL_DIST_MIN));
    const distanceScore = Math.min(
        Math.cos(Math.PI * .5 * distance),
        this.CATTAIL_CHANCE_RAMP * distance);

    return beachFactor * distanceScore;
};

/**
 * Get the shrubbery factor
 * @param {Number} shoreDistance The distance to the nearest body of water
 * @param {Number} beachFactor The beach factor
 * @returns {Number} The shrubbery factor
 */
Planter.prototype.getShrubberyFactor = function(shoreDistance, beachFactor) {
    const shoreChance = Math.max(0, Math.min(1,
        (shoreDistance - this.SHRUBBERY_DIST_MIN) / this.SHRUBBERY_DIST_MAX));

    return shoreChance * (1 - beachFactor);
};

/**
 * Get the direction to the nearest body of water
 * @param {Number} x The X coordinate in meters
 * @param {Number} y The Y coordinate in meters
 */
Planter.prototype.directionToWater = function(x, y) {
    const left = this.biome.sampleSDF(x - this.EPSILON, y);
    const right = this.biome.sampleSDF(x + this.EPSILON, y);

    if (left > right)
        return 1;

    return -1;
};

/**
 * Plant all plants into slots
 * @param {Plants} plants The plants object
 * @param {Number[]} vertices The vertex array
 * @param {Number[]} indices The index array
 * @returns {BugSpot[]} Spots for bugs to land on
 */
Planter.prototype.plant = function(plants, vertices, indices) {
    const bugSpots = [];
    const occupation = new Occupation(this.plantMap.width, this.plantMap.height, this.SHRUBBERY_DENSITY);

    for (const slot of this.hiddenSlots.slots)
        plants.modelShrubbery(
            slot.x,
            slot.y,
            this.SHRUBBERY_HIDDEN_SIZE.sample(this.random.getFloat()),
            this.directionToWater(slot.x, slot.y),
            this.random,
            vertices,
            indices);

    for (const slot of this.slots.slots) if (slot) {
        const shoreDistance = this.biome.sampleSDF(slot.x, slot.y);
        const minRocks = Math.min(
            this.biome.sampleRocksPonds(slot.x, slot.y),
            this.biome.sampleRocksRiver(slot.x, slot.y));
        const beachFactor = 1 - Math.min(1, minRocks / this.BEACH_MAX);
        const cattailFactor = this.getCattailFactor(shoreDistance, beachFactor);
        const shrubberyFactor = this.getShrubberyFactor(
            shoreDistance,
            beachFactor);

        if (!occupation.occupied(slot.x, slot.y, 1) &&
            this.random.getFloat() < shrubberyFactor) {
            plants.modelShrubbery(
                slot.x,
                slot.y,
                shrubberyFactor,
                this.directionToWater(slot.x, slot.y),
                this.random,
                vertices,
                indices);

            occupation.occupy(slot.x, slot.y, 1);
        }
        else if (this.random.getFloat() < cattailFactor * this.CATTAIL_CHANCE)
            bugSpots.push(...plants.modelCattail(
                slot.x,
                slot.y,
                this.random,
                vertices,
                indices));
        else if (shoreDistance > this.GRASS_CLEARANCE) {
            plants.modelGrass(
                slot.x,
                slot.y,
                minRocks,
                shoreDistance,
                this.random,
                vertices,
                indices);

            this.plantMap.add(slot.x, slot.y);
        }
    }

    this.plantMap.toDensity();

    return bugSpots;
};