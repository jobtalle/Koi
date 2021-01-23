/**
 * Mutate a set of fins in place
 * @param {Fins} fins The fins
 * @constructor
 */
const MutatorFins = function(fins) {
    this.fins = fins;
};

MutatorFins.prototype = Object.create(Mutator.prototype);
MutatorFins.prototype.FIN_RANGES = [
    [
        new Bounds(.1, .3)
    ],
    [
        new Bounds(.1, .3),
        new Bounds(.5, .7)
    ],
    [
        new Bounds(.1, .25),
        new Bounds(.35, .6),
        new Bounds(.7, .9)
    ]
];

/**
 * Mutate the fins
 * @param {Random} random A randomizer
 */
MutatorFins.prototype.mutate = function(random) {
    // TODO: Change count sometimes
    for (let fin = 0, finCount = this.fins.fins.length; fin < finCount; ++fin) {
        const range = this.FIN_RANGES[finCount][fin];

        new MutatorFin(this.fins.fins[fin]).mutate(
            this.clampUint8(range.min * 0xFF),
            this.clampUint8(range.max * 0xFF),
            random);
    }
};