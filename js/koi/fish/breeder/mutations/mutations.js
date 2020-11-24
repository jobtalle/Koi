/**
 * Predefined mutations
 */
const Mutations = [
    // White with yellow spots
    new Mutation(
        [
            new Mutation.LayerFootprint(LayerBase.prototype.ID, 0)
        ],
        [
            new Mutation.LayerFootprint(LayerBase.prototype.ID, 2)
        ],
        [
            Blueprints.baseWhite.blueprintBody.blueprintPattern.blueprintLayerBase,
            Blueprints.mutationSpotsGold
        ],
        .1
    )
];