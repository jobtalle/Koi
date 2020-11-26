/**
 * Predefined mutations
 */
const Mutations = function() {
    this.mutations = this.createMutations();
};

/**
 * Serialize the mutations state
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Mutations.prototype.serialize = function(buffer) {
    // TODO
};

/**
 * Deserialize the mutations state
 * @param {BinBuffer} buffer A buffer to serialize from
 */
Mutations.prototype.deserialize = function(buffer) {
    // TODO
};

/**
 * Create the list of possible mutations
 * @returns {Mutation[]} An array containing all possible mutations
 */
Mutations.prototype.createMutations = function() {
    return [
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 0)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 3)
            ],
            [
                Blueprints.baseWhite.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsRedOnWhite
            ],
            .2
        ),
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 0)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 3)
            ],
            [
                Blueprints.baseRed.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsWhiteOnRed
            ],
            .2
        ),
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 0)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 1)
            ],
            [
                Blueprints.baseBlack.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsWhiteOnRed
            ],
            .2
        ),
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 0)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 1)
            ],
            [
                Blueprints.baseWhite.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsBlackOnWhite
            ],
            .2
        ),
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 1)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 3)
            ],
            [
                Blueprints.baseBlack.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsLightRedOnBlack
            ],
            .2
        ),
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 1)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 2)
            ],
            [
                Blueprints.baseGold.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsBlackOnGold
            ],
            .2
        ),
        new Mutation(
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 2),
                new Mutation.LayerFootprint(LayerSpots.prototype.ID, 0)
            ],
            [
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 1),
                new Mutation.LayerFootprint(LayerSpots.prototype.ID, 1)
            ],
            [
                Blueprints.mutationBaseBrown
            ],
            .2
        )
    ];
};