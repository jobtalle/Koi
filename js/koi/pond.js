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
    // TODO: See if this really requires 3 loops
    for (const fish of this.fishes)
        fish.velocityPrevious.set(fish.velocity);

    for (let fish = 0; fish < this.fishes.length; ++fish) for(let other = fish + 1; other < this.fishes.length; ++other)
        this.fishes[fish].interact(this.fishes[other], random);

    for (const fish of this.fishes)
        fish.update(this.constraint, random);
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