/**
 * A mutation that may occur
 * @param {PatternFootprint} mother A pattern footprint
 * @param {PatternFootprint} father A pattern footprint
 * @param {(BlueprintLayer|{})[]} mutations An array of mutated layer blueprints, or one of the valid layer constants
 * @param {Number} probability The probability of this mutation occurring in the range [0, 1]
 * @param {Boolean} [symmetrical] True if the order of inputs does not matter
 * @constructor
 */
const Mutation = function(
    mother,
    father,
    mutations,
    probability,
    symmetrical = null) {
    this.mother = mother;
    this.father = father;
    this.mutations = mutations;
    this.probability = probability;
    this.symmetrical = symmetrical === null ? this.isSymmetrical() : symmetrical;
};

Mutation.BLUEPRINT_LAYER_MIX = {};
Mutation.BLUEPRINT_LAYER_MOTHER = {};
Mutation.BLUEPRINT_LAYER_FATHER = {};
Mutation.BLUEPRINT_PALETTE_FLAG_RELATIVE = 0x400;
Mutation.BLUEPRINT_PALETTE_FLAG_NEGATIVE = 0x200;
Mutation.BLUEPRINT_PALETTE_FLAG_MOTHER = 0x100;

/**
 * Create a non absolute palette reference
 * @param {Boolean} mother True if referring to the mother palette, false if referring to the father palette
 * @param {Number} [delta] The layer delta to read a palette from
 */
Mutation.createPaletteReference = function(mother, delta= 0) {
    let flag = Mutation.BLUEPRINT_PALETTE_FLAG_RELATIVE;

    if (delta < 0)
        flag |= Mutation.BLUEPRINT_PALETTE_FLAG_NEGATIVE;

    if (mother)
        flag |= Mutation.BLUEPRINT_PALETTE_FLAG_MOTHER;

    flag |= Math.abs(delta);

    return flag;
};

/**
 * Evaluate whether this mutation is symmetrical, or whether the order of inputs must be respected
 * @returns {Boolean} True if this mutation is symmetrical
 */
Mutation.prototype.isSymmetrical = function() {
    return this.mother.equals(this.father);
};

/**
 * Make an array of all palette indices found in two patterns
 * @param {Pattern} mother A pattern
 * @param {Pattern} father A pattern
 * @returns {Number[]} An array containing all palette indices
 */
Mutation.prototype.collectColors = function(mother, father) {
    const colors = [mother.base.paletteIndex, father.base.paletteIndex];

    for (const layer of mother.layers)
        colors.push(layer.paletteIndex);

    for (const layer of father.layers)
        colors.push(layer.paletteIndex);

    return colors;
};

/**
 * Check whether two given patterns match the footprint
 * @param {Pattern} mother A pattern
 * @param {Pattern} father A pattern
 * @param {Number[]} colors All palette indices contained by both patterns
 * @returns {Boolean} True if the patterns match the footprint
 */
Mutation.prototype.applicable = function(mother, father, colors) {
    return this.mother.matches(mother, father, colors) && this.father.matches(father, mother, colors);
};

/**
 * Check whether this mutation should be applied to two given patterns
 * @param {Pattern} mother A pattern
 * @param {Pattern} father A pattern
 * @param {Boolean} force Set to true if mutation should occur whenever possible
 * @param {Random} random A randomizer
 * @returns {Boolean} True if this mutation is applicable to the given layer arrays
 */
Mutation.prototype.mutates = function(mother, father, force, random) {
    console.log(this);
    if (!force && random.getFloat() > this.probability)
        return false;

    const colors = this.collectColors(mother, father);

    return this.applicable(mother, father, colors) || this.applicable(father, mother, colors);
};

/**
 * Extract a layer from an input pattern
 * @param {Pattern} pattern The input pattern
 * @param {Number} index The index, with 0 as the base layer
 * @returns {Layer} The extracted layer
 */
Mutation.prototype.getInputLayer = function(pattern, index) {
    if (index === 0)
        return pattern.base;

    return pattern.layers[index - 1];
};

/**
 * Get the parsed palette index
 * @param {Pattern} mother The A pattern
 * @param {Pattern} father The B pattern
 * @param {Number} index The index of the layer to mutate
 * @param {Number} paletteIndex The palette index to parse
 * @returns {Number} The parsed palette index
 */
Mutation.prototype.parsePaletteIndex = function(mother, father, index, paletteIndex) {
    if (paletteIndex & Mutation.BLUEPRINT_PALETTE_FLAG_RELATIVE) {
        const extractedIndex = paletteIndex & 0xFF;
        const delta = paletteIndex & Mutation.BLUEPRINT_PALETTE_FLAG_NEGATIVE ? -extractedIndex : extractedIndex;

        if (paletteIndex & Mutation.BLUEPRINT_PALETTE_FLAG_MOTHER)
            return this.getInputLayer(mother, index + delta).paletteIndex;
        else
            return this.getInputLayer(father, index + delta).paletteIndex;
    }

    return paletteIndex;
};

/**
 * Make a layer according to the mutation
 * @param {Pattern} mother The mother pattern
 * @param {Pattern} father The father pattern
 * @param {Number} index The index of the layer to mutate
 * @param {Function} mixLayers A function that mixes two layers with an equal ID
 * @param {Random} random A randomizer
 * @returns {Layer} The mutated layer
 */
Mutation.prototype.makeLayer = function(mother, father, index, mixLayers, random) {
    const mutation = this.mutations[index];

    switch (mutation) {
        case Mutation.BLUEPRINT_LAYER_MOTHER:
            return this.getInputLayer(mother, index).copy();
        case Mutation.BLUEPRINT_LAYER_FATHER:
            return this.getInputLayer(father, index).copy();
        case Mutation.BLUEPRINT_LAYER_MIX:
            return mixLayers(this.getInputLayer(mother, index), this.getInputLayer(father, index), random);
        default:
            return mutation.spawn(random, this.parsePaletteIndex(mother, father, index, mutation.paletteIndex));
    }
};

/**
 * Apply the mutation
 * @param {Pattern} mother A pattern
 * @param {Pattern} father A pattern
 * @param {LayerShapeBody} shapeBody A body shape layer for the mutated pattern
 * @param {LayerShapeFin} shapeFin A fin shape layer for the mutated pattern
 * @param {Function} mixLayers A function that mixes two layers with an equal ID
 * @param {Random} random A randomizer
 * @returns {Pattern} The mutated pattern
 */
Mutation.prototype.apply = function(
    mother,
    father,
    shapeBody,
    shapeFin,
    mixLayers,
    random) {
    if (this.symmetrical || !this.applicable(mother, father, this.collectColors(mother, father))) {
        const temp = mother;

        mother = father;
        father = temp;
    }

    const base = this.makeLayer(mother, father, 0, mixLayers, random);
    const layers = [];

    for (let layer = 1; layer < this.mutations.length; ++layer)
        layers.push(this.makeLayer(mother, father, layer, mixLayers, random));

    return new Pattern(
        base,
        layers,
        shapeBody,
        shapeFin);
};