/**
 * The card slot requirements, applied to slots on even pages
 * @type {CardRequirement[][]}
 */
const CardRequirements = [
    [
        null, null, null, null
    ],
    [
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.id, Palette.INDEX_ORANGE)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.id, Palette.INDEX_GOLD)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.id, Palette.INDEX_WHITE)
        ])),
        new CardRequirement(new PatternFootprint([
            new LayerFootprint(LayerBase.prototype.id, Palette.INDEX_BLACK)
        ]))
    ]
];