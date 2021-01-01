/**
 * The card slot requirements, applied to slots on even pages
 * @type {CardRequirement[][]}
 */
const CardRequirements = [
    [
        null, null, null, null
    ],
    [
        null,
        null,
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_WHITE)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_BLACK)
        ]))
    ],
    [
        null, null, null, null
    ],
    [
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_ORANGE)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_GOLD)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_WHITE)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_BLACK)
        ]))
    ],
    [
        null, null, null, null
    ],
    [
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_BLACK),
            new LayerFootprint(LayerStripes.prototype.ID, Palette.INDEX_WHITE)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_BLACK),
            new LayerFootprint(LayerRidge.prototype.ID, Palette.INDEX_GOLD)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_WHITE),
            new LayerFootprint(LayerSpots.prototype.ID, Palette.INDEX_ORANGE),
            new LayerFootprint(LayerSpots.prototype.ID, Palette.INDEX_BLACK)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.ID, Palette.INDEX_BLACK),
            new LayerFootprint(LayerSpots.prototype.ID, Palette.INDEX_WHITE),
            new LayerFootprint(LayerSpots.prototype.ID, Palette.INDEX_GOLD)
        ]))
    ],
    [
        null, null, null, null
    ],
    [
        null, null, null, null
    ]
];