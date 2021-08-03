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
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
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
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
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
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
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
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
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
        .019, // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        .001  // Bordeaux
    ],
    [         // Transitions from brown
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        .87,  // Brown
        .12,  // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        .01,  // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from purple
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        .92,   // Purple
        .05,  // Blue
        .02,  // Pink
        0,    // Dark blue
        .01,  // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from blue
        .3,   // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        .1,   // Purple
        .5,   // Blue
        0,    // Pink
        .09,  // Dark blue
        0,    // Light purple
        .01,  // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
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
        .9,   // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from dark blue
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        .15,  // Blue
        0,    // Pink
        .85,  // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from light purple
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        .1,   // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        .9,   // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from teal
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        .97, // Teal
        .03, // Green
        0,    // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from green
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        .95,  // Green
        .05,  // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from dark green
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        .7,   // Green
        .3,   // Dark green
        0,    // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from light brown
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        .15,  // Brown
        0,    // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        .85,  // Light brown
        0     // Bordeaux
    ],
    [         // Transitions from bordeaux
        0,    // White
        0,    // Black
        0,    // Gold
        0,    // Orange
        0,    // Red
        0,    // Brown
        0,    // Purple
        0,    // Blue
        0,    // Pink
        0,    // Dark blue
        0,    // Light purple
        0,    // Teal
        0,    // Green
        0,    // Dark green
        0,    // Light brown
        1     // Bordeaux
    ]
];

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