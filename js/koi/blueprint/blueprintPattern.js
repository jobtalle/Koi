/**
 * A blueprint for a random pattern
 * @param {BlueprintLayerBase} blueprintLayerBase A base layer blueprint
 * @param {BlueprintLayerShapeBody} blueprintLayerShapeBody A body shape layer blueprint
 * @param {BlueprintLayerShapeFin} blueprintLayerShapeFin A fin shape layer blueprint
 * @param {BlueprintLayer[]} layerBlueprints An array of layer blueprints
 * @constructor
 */
const BlueprintPattern = function(
    blueprintLayerBase,
    blueprintLayerShapeBody,
    blueprintLayerShapeFin,
    layerBlueprints) {
    this.blueprintLayerBase = blueprintLayerBase;
    this.blueprintLayerShapeBody = blueprintLayerShapeBody;
    this.blueprintLayerShapeFin = blueprintLayerShapeFin;
    this.layerBlueprints = layerBlueprints;
};

/**
 * Spawn a pattern based on this blueprint
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {RandomSource} randomSource A random source
 * @param {Random} random A randomizer
 * @returns {Pattern} A pattern
 */
BlueprintPattern.prototype.spawn = function(
    atlas,
    randomSource,
    random) {
    const layers = [];

    for (const blueprint of this.layerBlueprints)
        layers.push(blueprint.spawn(random));

    const pattern = new Pattern(
        this.blueprintLayerBase.spawn(random),
        layers,
        this.blueprintLayerShapeBody.spawn(random),
        this.blueprintLayerShapeFin.spawn(random));

    atlas.write(pattern, randomSource);

    return pattern;
};