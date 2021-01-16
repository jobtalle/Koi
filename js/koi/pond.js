/**
 * A pond from which fish cannot escape
 * @param {Object} constraint The constraint defining this pond
 * @param {Function} onBreed A function that is called after breeding takes place
 * @param {Function} onMutate A function that is called when a pattern mutation occurs
 * @param {Boolean} [canBreed] A boolean indicating whether fish may breed in this pond
 * @constructor
 */
const Pond = function(constraint, onBreed, onMutate, canBreed = true) {
    this.constraint = constraint;
    this.onBreed = onBreed;
    this.onMutate = onMutate;
    this.canBreed = canBreed;
    this.fish = []; // TODO: Rename to fish
};

Pond.prototype.CHASE_RADIUS = 1;
Pond.prototype.CHASE_FORCE = 0.17;

/**
 * Serialize this pond
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Pond.prototype.serialize = function(buffer) {
    const relativePositions = new Array(this.fish.length);
    let validFishes = 0;

    for (let fish = 0; fish < this.fish.length; ++fish) {
        const position = this.constraint.getRelativePosition(this.fish[fish].position);

        if (position)
            ++validFishes;

        relativePositions[fish] = position;
    }

    buffer.writeUint16(validFishes);

    for (let fish = 0; fish < this.fish.length; ++fish) {
        if (relativePositions[fish]) {
            relativePositions[fish].serialize(buffer);

            this.fish[fish].serialize(buffer);
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
        this.fish.push(Fish.deserialize(
            buffer,
            this.constraint.getAbsolutePosition(this.constraint.deserializeRelativePosition(buffer)),
            atlas,
            randomSource));
};

/**
 * Get the number of fish in this pond
 * @returns {Number} The number of fish in this pond
 */
Pond.prototype.getFishCount = function() {
    return this.fish.length;
};

/**
 * Chase fish away from a given point
 * @param {Number} x The X position
 * @param {Number} y The Y position
 */
Pond.prototype.chase = function(x, y) {
    const origin = new Vector2(x, y);

    for (const fish of this.fish) {
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
    const relativePositions = new Array(this.fish.length);

    for (let fish = this.fish.length; fish-- > 0;) {
        relativePositions[fish] = this.constraint.getRelativePosition(this.fish[fish].position);
        // TODO: Arc path positions sometimes don't translate properly!
        if (relativePositions[fish]) {
            const newPosition = constraint.getAbsolutePosition(relativePositions[fish])

            if (newPosition)
                this.fish[fish].moveTo(newPosition);
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
    this.fish.splice(0, 0, fish);
};

/**
 * Remove a fish from the pond
 * @param {Number} index The index of this fish in the fish array
 * @param {Atlas} atlas The texture atlas
 */
Pond.prototype.removeFish = function(index, atlas) {
    this.fish[index].free(atlas);
    this.fish.splice(index, 1);
};

/**
 * Pick up a fish from the pond
 * @param {Number} x The X position
 * @param {Number} y The Y position
 * @param {Fish[]} whitelist The whitelist of fish that may be interacted with
 * @returns {Fish} The fish at the given position, or null if no fish exists there
 */
Pond.prototype.pick = function(x, y, whitelist) {
    if (!this.constraint.contains(x, y))
        return null;

    for (let fish = this.fish.length; fish-- > 0;) if (this.fish[fish].body.atPosition(x, y)) {
        if (!whitelist || whitelist.indexOf(this.fish[fish]) !== -1) {
            const picked = this.fish[fish];

            this.fish.splice(fish, 1);

            return picked;
        }
    }

    return null;
};

/**
 * Update this pond and its contents
 * @param {Atlas} atlas The atlas to render newly spawned patterns on
 * @param {Patterns} patterns The pattern renderer
 * @param {RandomSource} randomSource A random source
 * @param {Mutations} mutations The mutations object, or null if mutation is disabled
 * @param {Boolean} forceMutation True if at least one mutation must occur when possible during breeding
 * @param {Water} water A water plane to disturb
 * @param {Constellation} constellation The constellation containing all ponds
 * @param {Boolean} raining True if it's raining
 * @param {Random} random A randomizer
 */
Pond.prototype.update = function(
    atlas,
    patterns,
    randomSource,
    mutations,
    forceMutation,
    water,
    constellation,
    raining,
    random) {
    for (let a = this.fish.length; a-- > 0;) {
        const fish = this.fish[a];

        for (let b = a; b-- > 0;)
            fish.interact(this.fish[b], random);

        if (fish.update(this.constraint, water, raining, random))
            this.removeFish(a, atlas);
        else {
            if (constellation.getFishCount() < Koi.prototype.FISH_CAPACITY - 1 &&
                this.canBreed && fish.interactions === 1) {
                if (fish.canMate() && fish.lastInteraction.canMate()) {
                    fish.mate(random);
                    fish.lastInteraction.mate(random);

                    let mutated = false;
                    const onMutate = () => {
                        mutated = true;

                        this.onMutate();
                    };

                    const breeder = random.getFloat() < .5 ?
                        new Breeder(fish, fish.lastInteraction) :
                        new Breeder(fish.lastInteraction, fish);
                    const offspring = breeder.breed(
                        atlas,
                        patterns,
                        randomSource,
                        mutations,
                        forceMutation,
                        onMutate,
                        random);

                    for (const fish of offspring) {
                        if (constellation.getFishCount() < Koi.prototype.FISH_CAPACITY - 1)
                            this.addFish(fish);
                        else
                            break;
                    }

                    this.onBreed(this, mutated);
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
    for (const fish of this.fish)
        fish.render(bodies, time);
};