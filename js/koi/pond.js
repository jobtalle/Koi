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
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Pond.prototype.deserialize = function(buffer, atlas) {
    for (let fish = 0, fishCount = buffer.readUint16(); fish < fishCount; ++fish)
        this.fishes.push(Fish.deserialize(
            buffer,
            this.constraint.getAbsolutePosition(this.constraint.deserializeRelativePosition(buffer)),
            atlas));
};

/**
 * Update the atlas, write all fish textures again
 * @param {Atlas} atlas The atlas
 */
Pond.prototype.updateAtlas = function(atlas) {
    for (const fish of this.fishes)
        atlas.write(fish.body.pattern);
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
    this.fishes.push(fish);
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
 * @param {Atlas} atlas The texture atlas
 * @param {Water} water A water plane to disturb
 * @param {Random} random A randomizer
 */
Pond.prototype.update = function(atlas, water, random) {
    for (let fish = this.fishes.length; fish-- > 0;) {
        for (let other = fish; other-- > 0;)
            this.fishes[fish].interact(this.fishes[other], random);

        if (this.fishes[fish].update(this.constraint, water, random))
            this.removeFish(fish, atlas);
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