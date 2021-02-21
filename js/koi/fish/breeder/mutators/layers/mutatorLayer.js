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
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0     // Pink
    ],
    [         // Transitions from black
        0,    // White
        1,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0     // Pink
    ],
    [         // Transitions from gold
        0,    // White
        0,    // Black
        .9,   // Gold
        .1,   // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0     // Pink
    ],
    [         // Transitions from orange
        0,    // White
        0,    // Black
        .07,  // Gold
        .87,  // Orange
        .06,  // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0     // Pink
    ],
    [         // Transitions from red
        0,    // White
        0,    // Black
        0,    // Gold
        .08,  // Orange
        .9,   // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        .02   // Pink
    ],
    [         // Transitions from brown
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        .8,   // Brown
        .2,   // Purple
        0,    // Blue
        0     // Pink
    ],
    [         // Transitions from purple
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        .95,  // Purple
        .05,   // Blue
        0     // Pink
    ],
    [         // Transitions from blue
        .5,   // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        .2,   // Purple
        .3,   // Blue
        0     // Pink
    ],
    [         // Transitions from pink
        .1,   // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        .9    // Pink
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

        if (randomValue < chanceSum) {
            if (otherColors.indexOf(next) === -1)
                this.layer.paletteIndex = next;

            break;
        }
    }
};