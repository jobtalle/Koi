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
 * Create all color related mutations
 * @returns {Mutation[]} The mutations
 */
Mutations.prototype.createMutationsColor = function() {
    return [
        // Two golden koi become orange
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_GOLD)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_GOLD)
            ]),
            [
                new BlueprintLayerBase(Palette.INDEX_ORANGE)
            ],
            .2
        ),
        // Two orange koi become red
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_ORANGE)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_ORANGE)
            ]),
            [
                new BlueprintLayerBase(Palette.INDEX_RED)
            ],
            .1
        )
    ];
};

/**
 * Create all spots pattern related mutations
 * @returns {Mutation[]} The mutations
 */
Mutations.prototype.createMutationsSpots = function() {
    return [
        // Two solid but different colored fish can become one color + spots of the other color
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE_LAYER)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE_LAYER)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                new BlueprintLayerSpots(
                    // Palette index
                    Mutation.createPaletteReference(false, -1),
                    // Scale
                    new Sampler(100, 130),
                    // Stretch
                    new Sampler(120, 136),
                    // Threshold
                    new Sampler(180, 200),
                    // X focus
                    new Sampler(120, 136),
                    // Y focus
                    new Sampler(120, 136),
                    // Power
                    new Sampler(160, 170)
                )
            ],
            .2
        ),
        // Spotted fish + solid color can become an extra layer of spots
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_UNIQUE)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                Mutation.BLUEPRINT_LAYER_MOTHER,
                new BlueprintLayerSpots(
                    // Palette index
                    Mutation.createPaletteReference(false, -2),
                    // Scale
                    new Sampler(220, 250),
                    // Stretch
                    new Sampler(120, 136),
                    // Threshold
                    new Sampler(180, 200),
                    // X focus
                    new Sampler(120, 136),
                    // Y focus
                    new Sampler(120, 136),
                    // Power
                    new Sampler(160, 170)
                )
            ],
            .2
        )
    ];
};

/**
 * Create all stripes pattern related mutations
 * @returns {Mutation[]} The mutations
 */
Mutations.prototype.createMutationsStripes = function() {
    return [
        // Two spots layered fish with the same colors may become stripes
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_SHARED),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_SHARED)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_SHARED),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_SHARED)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                new BlueprintLayerStripes(
                    // Palette index
                    Mutation.createPaletteReference(true, 0),
                    // Scale
                    new Sampler(108, 148),
                    // Distortion
                    new Sampler(108, 148),
                    // Roughness
                    new Sampler(108, 148),
                    // Threshold
                    new Sampler(108, 148),
                    // Slant
                    new Sampler(108, 148),
                    // Suppression
                    new Sampler(108, 148),
                    // Focus
                    new Sampler(108, 148),
                    // Power
                    new Sampler(108, 148))
            ],
            1
        )
    ];
};

/**
 * Create the list of possible mutations
 * @returns {Mutation[]} An array containing all possible mutations
 */
Mutations.prototype.createMutations = function() {
    return [
        ...this.createMutationsColor(),
        ...this.createMutationsSpots(),
        ...this.createMutationsStripes()
    ];
};