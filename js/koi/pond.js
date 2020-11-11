/**
 * A pond from which fish cannot escape
 * @param {Object} constraint The constraint defining this pond
 * @param {Boolean} [canBreed] A boolean indicating whether fish may breed in this pond
 * @constructor
 */
const Pond = function(constraint, canBreed = true) {
    this.constraint = constraint;
    this.canBreed = canBreed;
    this.fishes = [];
};

Pond.prototype.CHASE_RADIUS = 1;
Pond.prototype.CHASE_FORCE = 0.17;

/**
 * Serialize this pond
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Pond.prototype.serialize = function(buffer) {
    const relativePositions = new Array(this.fishes.length);
    let validFishes = 0;

    for (let fish = 0; fish < this.fishes.length; ++fish) {
        const position = this.constraint.getRelativePosition(this.fishes[fish].position);

        if (position)
            ++validFishes;

        relativePositions[fish] = position;
    }

    buffer.writeUint16(validFishes);

    for (let fish = 0; fish < this.fishes.length; ++fish) {
        if (relativePositions[fish]) {
            relativePositions[fish].serialize(buffer);

            this.fishes[fish].serialize(buffer);
        }
    }
};

/**
 * Deserialize this pond
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @param {Atlas} atlas The atlas
 * @param {RandomSource} randomSource A random source
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Pond.prototype.deserialize = function(buffer, atlas, randomSource) {
    for (let fish = 0, fishCount = buffer.readUint16(); fish < fishCount; ++fish)
        this.fishes.push(Fish.deserialize(
            buffer,
            this.constraint.getAbsolutePosition(this.constraint.deserializeRelativePosition(buffer)),
            atlas,
            randomSource));
};

/**
 * Get the number of fishes in this pond
 * @returns {Number} The number of fishes in this pond
 */
Pond.prototype.getFishCount = function() {
    return this.fishes.length;
};

/**
 * Chase fish away from a given point
 * @param {Number} x The X position
 * @param {Number} y The Y position
 */
Pond.prototype.chase = function(x, y) {
    const origin = new Vector2(x, y);

    for (const fish of this.fishes) {
        const dx = fish.position.x - x;
        const dy = fish.position.y - y;

        if (dx * dx + dy * dy < this.CHASE_RADIUS * this.CHASE_RADIUS)
            fish.chase(origin, this.CHASE_FORCE * Math.sqrt(dx * dx + dy * dy) / this.CHASE_RADIUS);
    }
};

/**
 * Replace this ponds constraint
 * @param {Object} constraint A new constraint
 * @param {Atlas} atlas The texture atlas
 */
Pond.prototype.replaceConstraint = function(constraint, atlas) {
    const relativePositions = new Array(this.fishes.length);

    for (let fish = this.fishes.length; fish-- > 0;) {
        relativePositions[fish] = this.constraint.getRelativePosition(this.fishes[fish].position);
        // TODO: Arc path positions sometimes don't translate properly!
        if (relativePositions[fish]) {
            const newPosition = constraint.getAbsolutePosition(relativePositions[fish])

            if (newPosition)
                this.fishes[fish].moveTo(newPosition);
            else
                this.removeFish(fish, atlas);
        }
        else
            this.removeFish(fish, atlas);
    }

    this.constraint = constraint;
}

/**
 * Add a fish to this pond
 * @param {Fish} fish A fish
 */
Pond.prototype.addFish = function(fish) {
    this.fishes.splice(0, 0, fish);
};

/**
 * Remove a fish from the pond
 * @param {Number} index The index of this fish in the fish array
 * @param {Atlas} atlas The texture atlas
 */
Pond.prototype.removeFish = function(index, atlas) {
    this.fishes[index].free(atlas);
    this.fishes.splice(index, 1);
};

/**
 * Pick up a fish from the pond
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @returns {Fish} The fish at the given position, or null if no fish exists there
 */
Pond.prototype.pick = function(x, y) {
    if (!this.constraint.contains(x, y))
        return null;

    for (let fish = this.fishes.length; fish-- > 0;) if (this.fishes[fish].body.atPosition(x, y)) {
        const picked = this.fishes[fish];

        this.fishes.splice(fish, 1);

        return picked;
    }

    return null;
};

/**
 * Update this pond and its contents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The pattern renderer
 * @param {RandomSource} randomSource A random source
 * @param {Water} water A water plane to disturb
 * @param {Constellation} constellation The constellation containing all ponds
 * @param {Random} random A randomizer
 */
Pond.prototype.update = function(
    atlas,
    patterns,
    randomSource,
    water,
    constellation,
    random) {
    for (let a = this.fishes.length; a-- > 0;) {
        const fish = this.fishes[a];

        for (let b = a; b-- > 0;)
            fish.interact(this.fishes[b], random);

        if (fish.update(this.constraint, water, random))
            this.removeFish(a, atlas);
        else {
            if (constellation.getFishCount() < Koi.prototype.FISH_CAPACITY && this.canBreed && fish.interactions === 1) {
                if (fish.canMate() && fish.lastInteraction.canMate()) {
                    fish.mate(random);
                    fish.lastInteraction.mate(random);

                    const breeder = random.getFloat() < .5 ?
                        new Breeder(fish, fish.lastInteraction) :
                        new Breeder(fish.lastInteraction, fish);
                    const offspring = breeder.breed(atlas, patterns, randomSource, random);

                    for (const fish of offspring) {
                        if (constellation.getFishCount() < Koi.prototype.FISH_CAPACITY)
                            this.addFish(fish);
                        else
                            break;
                    }
                }
            }
            else
                fish.mateTime = 0;

            fish.interactions = 0;
        }
    }
};

/**
 * Render this pond and its contents
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} time The interpolation factor
 */
Pond.prototype.render = function(bodies, time) {
    for (const fish of this.fishes)
        fish.render(bodies, time);
};