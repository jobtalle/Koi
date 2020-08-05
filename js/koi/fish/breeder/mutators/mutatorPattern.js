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

/**
 * Mutate a layer
 * @param {Layer} layer The layer
 * @param {Random} random A randomizer
 */
MutatorPattern.prototype.mutateLayer = function(layer, random) {
    switch (layer.id) {
        case LayerSpots.prototype.ID:
            new MutatorLayerSpots(layer).mutate(random);

            break;
    }
};

/**
 * Mutate the pattern
 * @param {Random} random A randomizer
 */
MutatorPattern.prototype.mutate = function(random) {
    for (const layer of this.pattern.layers)
        this.mutateLayer(layer, random);

    this.mutateBase.mutate(random);
    this.mutateShapeBody.mutate(random);
    this.mutateShapeFin.mutate(random);
};