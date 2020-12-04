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
    baseRed: new Blueprint(
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
                new BlueprintLayerBase(3),
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
    mutationBaseBrown: new BlueprintLayerBase(4),
    mutationSpotsRedOnWhite: new BlueprintLayerSpots(
        // Palette index
        0,
        // Scale
        new Sampler(50, 100),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(80, 100),
        // X focus
        new Sampler(120, 136),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(30, 50)),
    mutationSpotsWhiteOnRed: new BlueprintLayerSpots(
        // Palette index
        0,
        // Scale
        new Sampler(200, 230),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(180, 200),
        // X focus
        new Sampler(120, 136),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(160, 170)),
    mutationSpotsWhiteOnBlack: new BlueprintLayerSpots(
        // Palette index
        0,
        // Scale
        new Sampler(200, 230),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(180, 200),
        // X focus
        new Sampler(120, 136),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(160, 170)),
    mutationSpotsBlackOnWhite: new BlueprintLayerSpots(
        // Palette index
        1,
        // Scale
        new Sampler(160, 200),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(180, 200),
        // X focus
        new Sampler(170, 210),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(160, 170)),
    mutationSpotsBlackOnRed: new BlueprintLayerSpots(
        // Palette index
        1,
        // Scale
        new Sampler(200, 230),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(180, 200),
        // X focus
        new Sampler(120, 136),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(160, 170)),
    mutationSpotsBlackOnGold: new BlueprintLayerSpots(
        // Palette index
        0,
        // Scale
        new Sampler(200, 230),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(180, 200),
        // X focus
        new Sampler(120, 136),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(160, 170)),
    mutationSpotsLightRedOnBlack: new BlueprintLayerSpots(
        // Palette index
        1,
        // Scale
        new Sampler(200, 230),
        // Stretch
        new Sampler(120, 136),
        // Threshold
        new Sampler(180, 200),
        // X focus
        new Sampler(120, 136),
        // Y focus
        new Sampler(120, 136),
        // Power
        new Sampler(160, 170))
};