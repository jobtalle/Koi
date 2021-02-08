/**
 * A layer mutator
 * @param {Layer} layer A layer
 * @constructor
 */
const MutatorLayer = function(layer) {
    this.layer = layer;
};

MutatorLayer.prototype = Object.create(Mutator.prototype);
MutatorLayer.prototype.MUTATIONS = [
    [         // Transitions from white
        1,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0     // Brown
    ],
    [         // Transitions from black
        0,    // White
        1,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0     // Brown
    ],
    [         // Transitions from gold
        0,    // White
        0,    // Black
        .9,   // Gold
        .1,   // Orange
        0,    // Red
        0     // Brown
    ],
    [         // Transitions from orange
        0,    // White
        0,    // Black
        .07,  // Gold
        .87,  // Orange
        .06,  // Red
        0     // Brown
    ],
    [         // Transitions from red
        0,    // White
        0,    // Black
        0,    // Gold
        .06,  // Orange
        .94,  // Red
        0     // Brown
    ],
    [         // Transitions from brown
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        1     // Brown
    ]
]

/**
 * Mutate the layer
 * @param {Number[]} otherColors The other palette indices for this pattern
 * @param {Random} random A randomizer
 */
MutatorLayer.prototype.mutate = function(otherColors, random) {
    const randomValue = random.getFloat();
    let chanceSum = 0;

    for (let next = 0; next <= Palette.INDEX_LAST; ++next) {
        chanceSum += this.MUTATIONS[this.layer.paletteIndex][next];

        if (otherColors.indexOf(next) !== -1)
            continue;

        if (randomValue < chanceSum) {
            this.layer.paletteIndex = next;

            break;
        }
    }
};