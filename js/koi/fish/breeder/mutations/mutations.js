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
                new Mutation.LayerFootprint(LayerBase.prototype.ID, 2)
            ],
            [
                Blueprints.baseWhite.blueprintBody.blueprintPattern.blueprintLayerBase,
                Blueprints.mutationSpotsGold
            ],
            .1
        )
    ];
};