/**
 * Mutate a set of fins in place
 * @param {Fins} fins The fins
 * @constructor
 */
const MutatorFins = function(fins) {
    this.fins = fins;
};

MutatorFins.prototype = Object.create(Mutator.prototype);
MutatorFins.prototype.ADD_CHANCE = .05;
MutatorFins.prototype.REMOVE_CHANCE = .07;
MutatorFins.prototype.FIN_RANGES = [
    [
        new Bounds(.1, .3),
        new Bounds(.5, .7)
    ],
    [
        new Bounds(.1, .25),
        new Bounds(.4, .5),
        new Bounds(.7, .95)
    ]
];

/**
 * Mutate the fins
 * @param {Random} random A randomizer
 */
MutatorFins.prototype.mutate = function(random) {
    if (this.fins.fins.length < this.fins.FIN_PAIRS_MAX && random.getFloat() < this.ADD_CHANCE)
        this.fins.fins.push(this.fins.fins[this.fins.fins.length - 1].copy());
    else if (this.fins.fins.length > this.fins.FIN_PAIRS_MIN && random.getFloat() < this.REMOVE_CHANCE)
        this.fins.fins.splice(this.fins.fins.length - 1, 1);

    for (let fin = 0, finCount = this.fins.fins.length; fin < finCount; ++fin) {
        const range = this.FIN_RANGES[finCount - 2][fin];

        new MutatorFin(this.fins.fins[fin]).mutate(
            this.clampUint8(range.min * 0xFF),
            this.clampUint8(range.max * 0xFF),
            random);
    }
};