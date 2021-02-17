/**
 * A fish pattern mutator that mutates a fish body pattern in place
 * @param {Pattern} pattern The pattern
 * @constructor
 */
const MutatorPattern = function(pattern) {
    this.pattern = pattern;

    this.mutateBase = new MutatorLayerBase(pattern.base);
    this.mutateShapeBody = new MutatorLayerShapeBody(pattern.shapeBody);
    this.mutateShapeFin = new MutatorLayerShapeFin(pattern.shapeFin);
};

MutatorPattern.prototype = Object.create(Mutator.prototype);
MutatorPattern.prototype.LAYER_DISAPPEAR_CHANCE = .04;

/**
 * Mutate a layer
 * @param {Layer} layer The layer
 * @param {Random} random A randomizer
 */
MutatorPattern.prototype.mutateLayer = function(layer, random) {
    const colors = this.enumerateColors(layer);

    switch (layer.id) {
        case LayerSpots.prototype.ID:
            new MutatorLayerSpots(layer).mutate(colors, random);

            break;
        case LayerRidge.prototype.ID:
            new MutatorLayerRidge(layer).mutate(colors, random);

            break;
        case LayerStripes.prototype.ID:
            new MutatorLayerStripes(layer).mutate(colors, random);

            break;
        case LayerWeb.prototype.ID:
            new MutatorLayerWeb(layer).mutate(colors, random);

            break;
    }
};

/**
 * Enumerate all palette indices in this pattern except for the one of a certain layer
 * @param {Layer} except The layer to exempt from the enumeration
 * @returns {Number[]} An array of palette indices
 */
MutatorPattern.prototype.enumerateColors = function(except) {
    const colors = [];

    for (const layer of this.pattern.layers) if (layer !== except)
        colors.push(layer.paletteIndex);

    if (this.pattern.base !== except)
        colors.push(this.pattern.base.paletteIndex);

    return colors;
};

/**
 * Mutate the pattern
 * @param {Random} random A randomizer
 */
MutatorPattern.prototype.mutate = function(random) {
    for (let layer = this.pattern.layers.length; layer-- > 0;) {
        if (random.getFloat() < this.LAYER_DISAPPEAR_CHANCE)
            this.pattern.layers.splice(layer, 1);
        else
            this.mutateLayer(this.pattern.layers[layer], random);
    }

    this.mutateBase.mutate(this.enumerateColors(this.mutateBase.layer), random);
    this.mutateShapeBody.mutate(random);
    this.mutateShapeFin.mutate(random);
};