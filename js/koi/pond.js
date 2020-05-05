/**
 * A pond from which fish cannot escape
 * @param {Object} constraint The constraint defining this pond
 * @constructor
 */
const Pond = function(constraint) {
    this.constraint = constraint;
    this.fishes = [];
};

/**
 * Get the fish capacity of this pond
 * @returns {Number} The maximum number of fish that fit in this pond
 */
Pond.prototype.getCapacity = function() {
    return this.constraint.getCapacity();
};

/**
 * Add a fish to this pond
 * @param {Fish} fish A fish
 */
Pond.prototype.addFish = function(fish) {
    this.fishes.push(fish);
};

/**
 * Update this pond and its contents
 * @param {Random} random A randomizer
 */
Pond.prototype.update = function(random) {
    for (let fish = this.fishes.length; fish-- > 0;) {
        for (let other = fish - 1; other-- > 0;)
            this.fishes[fish].interact(this.fishes[other], random);

        if (this.fishes[fish].update(this.constraint, random)) {
            this.fishes.splice(fish, 1);
            // TODO: Free fish
        }
    }
};

/**
 * Render this pond and its contents
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Pond.prototype.render = function(renderer, time) {
    this.constraint.render(renderer);

    for (const fish of this.fishes)
        fish.render(renderer, time);
};