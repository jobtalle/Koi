/**
 * A mutation that may occur
 * @param {PatternFootprint} a A pattern footprint
 * @param {PatternFootprint} b A pattern footprint
 * @param {(BlueprintLayer|{})[]} mutations An array of mutated layer blueprints, or one of the valid layer constants
 * @param {Number} probability The probability of this mutation occurring in the range [0, 1]
 * @param {Boolean} [symmetrical] True if the order of inputs does not matter
 * @constructor
 */
const Mutation = function(
    a,
    b,
    mutations,
    probability,
    symmetrical = null) {
    this.a = a;
    this.b = b;
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
    return this.a.equals(this.b);
};

/**
 * Make an array of all palette indices found in two patterns
 * @param {Pattern} a A pattern
 * @param {Pattern} b A pattern
 * @returns {Number[]} An array containing all palette indices
 */
Mutation.prototype.collectColors = function(a, b) {
    const colors = [a.base.paletteIndex, b.base.paletteIndex];

    for (const layer of a.layers)
        colors.push(layer.paletteIndex);

    for (const layer of b.layers)
        colors.push(layer.paletteIndex);

    return colors;
};

/**
 * Check whether two given patterns match the footprint
 * @param {Pattern} a A pattern
 * @param {Pattern} b A pattern
 * @param {Number[]} colors All palette indices contained by both patterns
 * @returns {Boolean} True if the patterns match the footprint
 */
Mutation.prototype.applicable = function(a, b, colors) {
    return this.a.matches(a, b, colors);
};

/**
 * Check whether this mutation should be applied to two given patterns
 * @param {Pattern} a A pattern
 * @param {Pattern} b A pattern
 * @param {Boolean} force Set to true if mutation should occur whenever possible
 * @param {Random} random A randomizer
 * @returns {Boolean} True if this mutation is applicable to the given layer arrays
 */
Mutation.prototype.mutates = function(a, b, force, random) {
    if (!force && random.getFloat() > this.probability)
        return false;

    const colors = this.collectColors(a, b);

    return this.applicable(a, b, colors) || this.applicable(b, a, colors);
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
 * @param {Pattern} a The A pattern
 * @param {Pattern} b The B pattern
 * @param {Number} index The index of the layer to mutate
 * @param {Number} paletteIndex The palette index to parse
 * @returns {Number} The parsed palette index
 */
Mutation.prototype.parsePaletteIndex = function(a, b, index, paletteIndex) {
    if (paletteIndex & Mutation.BLUEPRINT_PALETTE_FLAG_RELATIVE) {
        const extractedIndex = paletteIndex & 0xFF;
        const delta = paletteIndex & Mutation.BLUEPRINT_PALETTE_FLAG_NEGATIVE ? -extractedIndex : extractedIndex;

        if (paletteIndex & Mutation.BLUEPRINT_PALETTE_FLAG_MOTHER)
            return this.getInputLayer(a, index + delta).paletteIndex;
        else
            return this.getInputLayer(b, index + delta).paletteIndex;
    }

    return paletteIndex;
};

/**
 * Make a layer according to the mutation
 * @param {Pattern} a The A pattern
 * @param {Pattern} b The B pattern
 * @param {Number} index The index of the layer to mutate
 * @param {Function} mixLayers A function that mixes two layers with an equal ID
 * @param {Random} random A randomizer
 * @returns {Layer} The mutated layer
 */
Mutation.prototype.makeLayer = function(a, b, index, mixLayers, random) {
    const mutation = this.mutations[index];

    switch (mutation) {
        case Mutation.BLUEPRINT_LAYER_MOTHER:
            return this.getInputLayer(a, index).copy();
        case Mutation.BLUEPRINT_LAYER_FATHER:
            return this.getInputLayer(b, index).copy();
        case Mutation.BLUEPRINT_LAYER_MIX:
            return mixLayers(this.getInputLayer(a, index), this.getInputLayer(b, index), random);
        default:
            return mutation.spawn(random, this.parsePaletteIndex(a, b, index, mutation.paletteIndex));
    }
};

/**
 * Apply the mutation
 * @param {Pattern} a A pattern
 * @param {Pattern} b A pattern
 * @param {LayerShapeBody} shapeBody A body shape layer for the mutated pattern
 * @param {LayerShapeFin} shapeFin A fin shape layer for the mutated pattern
 * @param {Function} mixLayers A function that mixes two layers with an equal ID
 * @param {Random} random A randomizer
 * @returns {Pattern} The mutated pattern
 */
Mutation.prototype.apply = function(
    a,
    b,
    shapeBody,
    shapeFin,
    mixLayers,
    random) {
    if (this.symmetrical || !this.applicable(a, b, this.collectColors(a, b))) {
        const temp = a;

        a = b;
        b = temp;
    }

    const base = this.makeLayer(a, b, 0, mixLayers, random);
    const layers = [];

    for (let layer = 1; layer < this.mutations.length; ++layer)
        layers.push(this.makeLayer(a, b, layer, mixLayers, random));

    return new Pattern(
        base,
        layers,
        shapeBody,
        shapeFin);
};