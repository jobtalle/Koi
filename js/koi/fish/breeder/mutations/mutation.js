/**
 * A mutation that may occur
 * @param {Mutation.LayerFootprint[]} a A layer footprint
 * @param {Mutation.LayerFootprint[]} b A layer footprint
 * @param {Object[]} mutations An array of mutated layer blueprints, or null when layers should mix
 * @param {Number} probability The probability of this mutation occurring in the range [0, 1]
 * @constructor
 */
const Mutation = function(
    a,
    b,
    mutations,
    probability) {
    this.a = a;
    this.b = b;
    this.mutations = mutations;
    this.probability = probability;
};

/**
 * A layer footprint to match a layer to
 * @param {Number} id The layer ID
 * @param {Number} paletteIndex The layer palette index
 * @constructor
 */
Mutation.LayerFootprint = function(id, paletteIndex) {
    this.id = id;
    this.paletteIndex = paletteIndex;
};

/**
 * Check if a layer matches this footprint
 * @param {Layer} layer A layer
 * @returns {Boolean} True if the given layer matches the footprint
 */
Mutation.LayerFootprint.prototype.matches = function(layer) {
    return layer.id === this.id && layer.paletteIndex === this.paletteIndex;
};

/**
 * Check whether two given patterns match the footprint
 * @param {Pattern} a A pattern
 * @param {Pattern} b A pattern
 * @returns {Boolean} True if the patterns match the footprint
 */
Mutation.prototype.applicable = function(a, b) {
    if (a.layers.length !== this.a.length - 1 || b.layers.length !== this.b.length - 1)
        return false;

    if (!this.a[0].matches(a.base) || !this.b[0].matches(b.base))
        return false;

    for (let layer = 0, layers = this.a.length - 1; layer < layers; ++layer)
        if (!this.a[layer + 1].matches(a.layers[layer]))
            return false;

    for (let layer = 0, layers = this.b.length - 1; layer < layers; ++layer)
        if (!this.b[layer + 1].matches(b.layers[layer]))
            return false;

    return true;
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

    return this.applicable(a, b) || this.applicable(b, a);
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
    const base = this.mutations[0] ? this.mutations[0].spawn(random) : mixLayers(a.base, b.base, random);
    const layers = [];

    for (let layer = 0, layerCount = this.mutations.length - 1; layer < layerCount; ++layer) {
        if (this.mutations[layer + 1])
            layers.push(this.mutations[layer + 1].spawn(random));
        else
            layers.push(mixLayers(a.layers[layer], b.layers[layer], random));
    }

    return new Pattern(
        base,
        layers,
        shapeBody,
        shapeFin);
};