// TODO: I think all these blueprints are just for spawning, could probably make them more specific then
/**
 * Blueprints
 */
const Blueprints = {
    baseWhite: new Blueprint(
        // School size
        new SamplerPlateau(1, 2, 5, 1),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(150, 180),
            // Radius
            new Sampler(200, 235),
            // Growth speed
            new Sampler(130, 170),
            // Mating frequency
            new Sampler(150, 160),
            // Offspring count
            new Sampler(130, 170),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(100, 140),
                // Skew
                new Sampler(150, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_WHITE),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(50, 100),
                    // Radius power
                    new Sampler(170, 200),
                    // Eye position
                    new Sampler(50, 100)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Roundness
                    new Sampler(200, 250)),
                // Layers
                []
            )
        )
    ),
    baseBlack: new Blueprint(
        // School size
        new SamplerPlateau(2, 4, 10, 1.7),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(150, 180),
            // Radius
            new Sampler(200, 235),
            // Growth speed
            new Sampler(130, 170),
            // Mating frequency
            new Sampler(150, 160),
            // Offspring count
            new Sampler(130, 170),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(100, 140),
                // Skew
                new Sampler(150, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_BLACK),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(50, 100),
                    // Radius power
                    new Sampler(170, 200),
                    // Eye position
                    new Sampler(50, 100)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Roundness
                    new Sampler(200, 250)),
                // Layers
                []
            )
        )
    ),
    baseGold: new Blueprint(
        // School size
        new SamplerPlateau(1, 2, 5, 1),
        // Body
        new BlueprintBody(
            // Length
            new Sampler(150, 180),
            // Radius
            new Sampler(200, 235),
            // Growth speed
            new Sampler(130, 170),
            // Mating frequency
            new Sampler(150, 160),
            // Offspring count
            new Sampler(130, 170),
            // Age
            new Sampler(20000, 25000),
            // Fins
            new BlueprintFins(),
            // Tail
            new BlueprintTail(
                // Length
                new Sampler(100, 140),
                // Skew
                new Sampler(150, 220)),
            // Pattern
            new BlueprintPattern(
                // Base
                new BlueprintLayerBase(Palette.INDEX_GOLD),
                // Body shape
                new BlueprintLayerShapeBody(
                    // Center power
                    new Sampler(50, 100),
                    // Radius power
                    new Sampler(170, 200),
                    // Eye position
                    new Sampler(50, 100)),
                // Fin shape
                new BlueprintLayerShapeFin(
                    // Roundness
                    new Sampler(200, 250)),
                // Layers
                []
            )
        )
    )
};