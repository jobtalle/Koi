/**
 * Predefined mutations
 */
const Mutations = function() {
    this.mutations = this.createMutations();
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
                    new Sampler(80, 100),
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
            .25
        ),
        // Two fish with different base colors and different spot colors can swap spot colors
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_UNIQUE)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_UNIQUE),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_UNIQUE)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                Mutation.BLUEPRINT_LAYER_FATHER
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
                    new Sampler(100, 160),
                    // X focus
                    new Sampler(120, 136),
                    // Y focus
                    new Sampler(120, 136),
                    // Power
                    new Sampler(160, 170)
                )
            ],
            .25
        ),
        // Two spotted fish with the same base color can become two spots layers
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_SHARED),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_UNIQUE_LAYER)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_SHARED),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_UNIQUE_LAYER)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MIX,
                Mutation.BLUEPRINT_LAYER_FATHER,
                Mutation.BLUEPRINT_LAYER_MOTHER_PREVIOUS
            ],
            .25
        )
    ];
};

/**
 * Create all stripes pattern related mutations
 * @returns {Mutation[]} The mutations
 */
Mutations.prototype.createMutationsStripes = function() {
    const blueprintStripes = new BlueprintLayerStripes(
        // Palette index
        Mutation.createPaletteReference(true, 0),
        // Scale
        new Sampler(140, 180),
        // Distortion
        new Sampler(108, 148),
        // Roughness
        new Sampler(108, 148),
        // Threshold
        new Sampler(108, 148),
        // Slant
        new Sampler(108, 148),
        // Suppression
        new Sampler(30, 50),
        // Focus
        new Sampler(108, 148),
        // Power
        new Sampler(108, 148));

    return [
        // Two spots layered fish with the same spot colors may become stripes
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_ANY),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_SHARED)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_ANY),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_SHARED)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                blueprintStripes
            ],
            .1
        )
    ];
};

/**
 * Create all ridge pattern related mutations
 * @returns {Mutation[]} The mutations
 */
Mutations.prototype.createMutationsRidge = function() {
    return [
        // A spotted and a striped fish create a ridged fish
        new Mutation(
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_ANY),
                new LayerFootprint(LayerSpots.prototype.ID, LayerFootprint.PALETTE_SHARED)
            ]),
            new PatternFootprint([
                new LayerFootprint(LayerBase.prototype.ID, LayerFootprint.PALETTE_ANY),
                new LayerFootprint(LayerStripes.prototype.ID, LayerFootprint.PALETTE_SHARED)
            ]),
            [
                Mutation.BLUEPRINT_LAYER_MOTHER,
                new BlueprintLayerRidge(
                    // Palette index
                    Mutation.createPaletteReference(true, 0),
                    // Scale
                    new Sampler(108, 148),
                    // Power
                    new Sampler(108, 148),
                    // Threshold
                    new Sampler(108, 148),
                    // Focus
                    new Sampler(108, 148),
                    // Focus power
                    new Sampler(108, 148))
            ],
            .15
        )
    ];
};

/**
 * Create all web related mutations
 * @returns {Mutation[]} The mutations
 */
Mutations.prototype.createMutationsWeb = function() {
    return [
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
                new BlueprintLayerWeb(
                    // Palette index
                    Mutation.createPaletteReference(true, 0),
                    // Scale
                    new Sampler(170, 190),
                    // Thickness
                    new Sampler(200, 230),
                    // Threshold
                    new Sampler(120, 136))
            ],
            .02
        )
    ];
};

/**
 * Create the list of possible mutations
 * @returns {Mutation[]} An array containing all possible mutations
 */
Mutations.prototype.createMutations = function() {
    return [
        ...this.createMutationsSpots(),
        ...this.createMutationsStripes(),
        ...this.createMutationsRidge(),
        ...this.createMutationsWeb()
    ];
};