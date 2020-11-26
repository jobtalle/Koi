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
                new BlueprintLayerBase(0),
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
                new BlueprintLayerBase(1),
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
                new BlueprintLayerBase(2),
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
    mutationSpotsGold: new BlueprintLayerSpots(
        0,
        new Sampler(50, 100),
        new Sampler(120, 136),
        new Sampler(80, 100),
        new Sampler(120, 136),
        new Sampler(120, 136),
        new Sampler(30, 50))
};