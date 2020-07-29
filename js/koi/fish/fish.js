/**
 * A fish
 * @param {FishBody} body The fish body
 * @param {Vector2} position The initial position
 * @param {Vector2} direction The initial direction vector, which must be normalized
 * @param {Number} growthSpeed The growth speed
 * @param {Number} matingFrequency The frequency with which this fish can mate in the range [0, 255]
 * @param {Number} [age] The fish age in updates, zero by default
 * @constructor
 */
const Fish = function(
    body,
    position,
    direction,
    growthSpeed,
    matingFrequency,
    age = 0) {
    this.position = position.copy();
    this.positionPrevious = position.copy();
    this.direction = direction.copy();
    this.velocity = direction.copy();
    this.growthSpeed = growthSpeed;
    this.matingFrequency = matingFrequency;
    this.body = body;
    this.speed = this.SPEED_MIN;
    this.boost = 0;
    this.turnDirection = new Vector2();
    this.turnForce = 0;
    this.nibbleTime = this.NIBBLE_TIME_MIN;
    this.age = age;
    this.samplerSize = new SamplerInverse(
        this.SIZE_MIN, 1,
        this.SAMPLER_GROWTH_MULTIPLIER.sample(growthSpeed / 0xFF));
    this.size = this.samplerSize.sample(this.age / 0xFFFF);
    this.mateTimeout = this.SAMPLER_MATING_FREQUENCY.sample(matingFrequency / 0xFF);
    this.mateTime = 0;
    this.mated = 0;
    this.interactions = 0;
    this.lastInteraction = null;

    this.body.initializeSpine(position, direction, this.size);
};

Fish.prototype.FORCE_CONSTRAINT = .6;
Fish.prototype.FORCE_REPULSION  = .45;
Fish.prototype.FORCE_ALIGNMENT = .05;
Fish.prototype.FORCE_ATTRACTION = .05;
Fish.prototype.RADIUS_REPULSION = .6;
Fish.prototype.RADIUS_ALIGNMENT = 1.25;
Fish.prototype.RADIUS_ATTRACTION = 1.5;
Fish.prototype.NIBBLE_TIME_MIN = 20;
Fish.prototype.NIBBLE_TIME_MAX = 40;
Fish.prototype.NIBBLE_RADIUS = .1;
Fish.prototype.NIBBLE_DISPLACEMENT = 0.25;
Fish.prototype.NIBBLE_TURN_FORCE = .07;
Fish.prototype.SPEED_BASE = .4;
Fish.prototype.SPEED_MIN = Math.fround(.015);
Fish.prototype.SPEED_MAX = Math.fround(.5);
Fish.prototype.SPEED_NIBBLE = .0155;
Fish.prototype.SPEED_SLOW = .025;
Fish.prototype.SPEED_DROP = .06;
Fish.prototype.SPEED_DECAY = .996;
Fish.prototype.SPEED_CATCH_UP = .0045;
Fish.prototype.BOOST_CHANCE = .003;
Fish.prototype.BOOST_POWER = .0015;
Fish.prototype.BOOST_MIN = 5;
Fish.prototype.BOOST_MAX = 30;
Fish.prototype.TURN_CHANCE = .0013;
Fish.prototype.TURN_FORCE = Math.fround(.06);
Fish.prototype.TURN_POWER = .4;
Fish.prototype.TURN_DECAY = .94;
Fish.prototype.TURN_THRESHOLD = .005;
Fish.prototype.TURN_CARRY = .95;
Fish.prototype.TURN_FOLLOW_CHANCE = .025;
Fish.prototype.TURN_AMPLITUDE = Math.PI * .4;
Fish.prototype.SIZE_MIN = .1;
Fish.prototype.SIZE_MATING = .7;
Fish.prototype.MATE_PROXIMITY_TIME = 120;
Fish.prototype.SAMPLER_GROWTH_MULTIPLIER = new SamplerQuadratic(50, 100, 4);
Fish.prototype.SAMPLER_MATING_FREQUENCY = new SamplerQuadratic(300, 4500, .3);

/**
 * Deserialize a fish
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @param {Vector2} position The fish position
 * @param {Atlas} atlas The atlas
 * @param {RandomSource} randomSource A random source
 * @returns {Fish} A fish
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Fish.deserialize = function(buffer, position, atlas, randomSource) {
    const body = FishBody.deserialize(buffer, atlas, randomSource);
    const direction = new Vector2().deserialize(buffer);

    if (!direction.isNormal())
        throw new RangeError();

    const fish = new Fish(body, position, direction, buffer.readUint8(), buffer.readUint8(), buffer.readUint16());

    fish.mated = buffer.readUint16();
    fish.mateTime = buffer.readUint8();

    if (fish.mateTime > Fish.prototype.MATE_PROXIMITY_TIME)
        throw new RangeError();

    fish.nibbleTime = buffer.readUint8();

    if (fish.nibbleTime > Fish.prototype.NIBBLE_TIME_MAX)
        throw new RangeError();

    fish.speed = buffer.readFloat();

    if (!(fish.speed >= Fish.prototype.SPEED_MIN && fish.speed <= Fish.prototype.SPEED_MAX))
        throw new RangeError();

    fish.boost = buffer.readUint8();

    if (fish.boost > Fish.prototype.BOOST_MAX)
        throw new RangeError();

    fish.turnForce = buffer.readFloat();

    if (!(fish.turnForce >= 0 && fish.turnForce <= Fish.prototype.TURN_FORCE))
        throw new RangeError();

    if (fish.turnForce !== 0) {
        fish.turnDirection.deserialize(buffer);

        if (!fish.turnDirection.isNormal())
            throw new RangeError();
    }

    return fish;
};

/**
 * Serialize this fish
 * @param {BinBuffer} buffer A buffer to serialize to
 */
Fish.prototype.serialize = function(buffer) {
    this.body.serialize(buffer);
    this.direction.serialize(buffer);

    buffer.writeUint8(this.growthSpeed);
    buffer.writeUint8(this.matingFrequency);
    buffer.writeUint16(this.age);

    buffer.writeUint16(Math.min(0xFFFF, this.mated));
    buffer.writeUint8(this.mateTime);
    buffer.writeUint8(this.nibbleTime);
    buffer.writeFloat(this.speed);
    buffer.writeUint8(this.boost);
    buffer.writeFloat(this.turnForce);

    if (this.turnForce !== 0)
        this.turnDirection.serialize(buffer);
};

/**
 * Move the fish to a given position
 * @param {Vector2} position The position to move to
 */
Fish.prototype.moveTo = function(position) {
    this.position.set(position);
    this.body.moveTo(position);
};

/**
 * Drop the fish into a new pond, orient along its body rotation
 * @param {Vector2} position The position to drop the fish at
 */
Fish.prototype.drop = function(position) {
    this.moveTo(position);
    this.speed = this.SPEED_DROP;
};

/**
 * Turn around
 * @param {Random} random A randomizer
 */
Fish.prototype.turn = function(random) {
    const angle = this.direction.angle() + Math.PI + this.TURN_AMPLITUDE * (random.getFloat() * 2 - 1);

    this.turnDirection.fromAngle(angle);
    this.turnForce = this.TURN_FORCE;
};

/**
 * Copy the turn behaviour from a neighbour
 * @param {Fish} other The fish to copy behaviour from
 */
Fish.prototype.copyTurn = function(other) {
    this.turnDirection.set(other.turnDirection);
    this.turnForce = other.turnForce * this.TURN_CARRY;
};

/**
 * Apply a turnDirection force
 */
Fish.prototype.applyTurn = function() {
    const magnitude = this.speed * (this.turnForce ** this.TURN_POWER);

    this.velocity.normalize().multiply(this.speed);

    if (this.direction.dot(this.turnDirection) > 0) {
        this.velocity.x += this.turnDirection.x * magnitude;
        this.velocity.y += this.turnDirection.y * magnitude;
    }
    else {
        if (this.direction.y * this.turnDirection.x - this.direction.x * this.turnDirection.y > 0) {
            this.velocity.x += this.direction.y * magnitude;
            this.velocity.y -= this.direction.x * magnitude;
        }
        else {
            this.velocity.x -= this.direction.y * magnitude;
            this.velocity.y += this.direction.x * magnitude;
        }
    }

    if (this.turnForce < this.TURN_THRESHOLD)
        this.turnForce = 0;
    else
        this.turnForce *= this.TURN_DECAY;
};

/**
 * This fish has just mated
 * @param {Random} random A randomizer
 */
Fish.prototype.mate = function(random) {
    this.mateTime = 0;
    this.mated = 0;

    this.turn(random);
    this.boostSpeed(random);
};

/**
 * Interact with another fish that may be in range, applying interaction to both fishes
 * @param {Fish} other Another fish
 * @param {Random} random A randomizer
 */
Fish.prototype.interact = function(other, random) {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const squaredDistance = dx * dx + dy * dy;

    if (squaredDistance < this.RADIUS_ATTRACTION * this.RADIUS_ATTRACTION) {
        const distance = Math.sqrt(squaredDistance);

        ++this.interactions;
        ++other.interactions;

        this.lastInteraction = other;
        other.lastInteraction = this;

        if (this.speed < other.speed)
            this.speed += (other.speed - this.speed) * this.SPEED_CATCH_UP;
        else if (other.speed < this.speed)
            other.speed += (this.speed - other.speed) * this.SPEED_CATCH_UP;

        if (distance < this.RADIUS_REPULSION) {
            const proximity = 1 - distance / this.RADIUS_REPULSION;
            const fx = proximity * this.FORCE_REPULSION * dx / distance;
            const fy = proximity * this.FORCE_REPULSION * dy / distance;

            this.velocity.x += this.speed * fx;
            this.velocity.y += this.speed * fy;
            other.velocity.x -= other.speed * fx;
            other.velocity.y -= other.speed * fy;

            if (this.turnForce === 0 && other.turnForce !== 0 && random.getFloat() < this.TURN_FOLLOW_CHANCE)
                this.copyTurn(other);
            else if (this.turnForce !== 0 && other.turnForce === 0 && random.getFloat() < this.TURN_FOLLOW_CHANCE)
                other.copyTurn(this);
        }
        else if (distance < this.RADIUS_ALIGNMENT) {
            this.velocity.x += this.speed * this.FORCE_ALIGNMENT * other.direction.x;
            this.velocity.y += this.speed * this.FORCE_ALIGNMENT * other.direction.y;
            other.velocity.x += other.speed * this.FORCE_ALIGNMENT * this.direction.x;
            other.velocity.y += other.speed * this.FORCE_ALIGNMENT * this.direction.y;
        }
        else {
            if (-dx * this.direction.x - dy * this.direction.y > 0) {
                this.velocity.x -= this.speed * this.FORCE_ATTRACTION * dx / distance;
                this.velocity.y -= this.speed * this.FORCE_ATTRACTION * dy / distance;
            }

            if (dx * other.direction.x + dy * other.direction.y > 0) {
                other.velocity.x += other.speed * this.FORCE_ATTRACTION * dx / distance;
                other.velocity.y += other.speed * this.FORCE_ATTRACTION * dy / distance;
            }
        }
    }
};

/**
 * Immediately constrain this fish within a constraint
 * @param {Constraint} constraint A constraint
 */
Fish.prototype.constrainHard = function(constraint) {
    this.velocity.set(constraint.normal);

    constraint.constrain(this.position);
};

/**
 * Constrain the fish within its constraint
 * @param {Constraint} constraint A constraint
 * @returns {Boolean} A boolean indicating whether the fish left the scene
 */
Fish.prototype.constrain = function(constraint) {
    const proximity = constraint.sample(this.position);

    if (proximity > 0) {
        if (proximity > 1)
            this.constrainHard(constraint);
        else {
            const magnitude = this.FORCE_CONSTRAINT * proximity;

            if (this.velocity.dot(constraint.normal) < 0) {
                if (this.velocity.y * constraint.normal.x - this.velocity.x * constraint.normal.y > 0) {
                    this.velocity.x += this.speed * this.direction.y * magnitude;
                    this.velocity.y -= this.speed * this.direction.x * magnitude;
                }
                else {
                    this.velocity.x -= this.speed * this.direction.y * magnitude;
                    this.velocity.y += this.speed * this.direction.x * magnitude;
                }
            }
            else {
                this.velocity.x += this.speed * constraint.normal.x * magnitude;
                this.velocity.y += this.speed * constraint.normal.y * magnitude;
            }

            this.turnForce = 0;

            return false;
        }
    }
    else if (proximity === -1)
        return true;
};

/**
 * Speed up
 * @param {Random} random A randomizer
 */
Fish.prototype.boostSpeed = function(random) {
    this.boost = this.BOOST_MIN + Math.floor(random.getFloat() * (this.BOOST_MAX - this.BOOST_MIN));
};

/**
 * Check whether this fish can mate
 * @returns {Boolean} true if this fish can mate
 */
Fish.prototype.canMate = function() {
    return this.mateTime === this.MATE_PROXIMITY_TIME;
};

/**
 * Update the fish
 * @param {Constraint} constraint A constraint
 * @param {Water} water A water plane to disturb
 * @param {Random} random A randomizer
 * @returns {Boolean} A boolean indicating whether the fish left the scene
 */
Fish.prototype.update = function(constraint, water, random) {
    if (this.constrain(constraint))
        return true;

    ++this.mated;

    if (this.mated > this.mateTimeout && this.size > this.SIZE_MATING) {
        if (this.mateTime < this.MATE_PROXIMITY_TIME)
            ++this.mateTime;
    }
    else
        this.mateTime = 0;

    if (this.age !== 0xFFFF)
        this.size = this.samplerSize.sample(++this.age / 0xFFFF);

    if (this.turnDirection)
        this.applyTurn();

    this.speed *= this.SPEED_DECAY;

    if (this.speed < this.SPEED_MIN)
        this.speed = this.SPEED_MIN;

    if (this.boost) {
        --this.boost;

        this.speed += this.BOOST_POWER;

        if (this.speed > this.SPEED_MAX)
            this.speed = this.SPEED_MAX;
    }

    this.direction.set(this.velocity).normalize();
    this.velocity.set(this.direction);

    if (this.speed < this.SPEED_SLOW) {
        if (this.boost === 0 && random.getFloat() < this.BOOST_CHANCE)
            this.boostSpeed(random);
        else if (this.turnForce === 0 && random.getFloat() < this.TURN_CHANCE)
            this.turn(random);
        else if (this.speed < this.SPEED_NIBBLE) if ((--this.nibbleTime === 0)) {
            this.nibbleTime = this.NIBBLE_TIME_MIN +
                Math.floor((this.NIBBLE_TIME_MAX - this.NIBBLE_TIME_MIN) * random.getFloat());

            water.addFlare(this.position.x, this.position.y, this.NIBBLE_RADIUS, this.NIBBLE_DISPLACEMENT);

            const turnForce = 2 * (random.getFloat() - .5) * this.NIBBLE_TURN_FORCE;

            this.velocity.x += this.direction.y * turnForce;
            this.velocity.y -= this.direction.x * turnForce;
            this.velocity.normalize();
        }
    }

    const adjustedSpeed = this.speed * (this.SPEED_BASE + (1 - this.SPEED_BASE) * this.size);

    this.positionPrevious.set(this.position);
    this.position.add(this.velocity.multiply(adjustedSpeed));
    this.body.update(this.position, this.direction, adjustedSpeed, this.size, water, random);

    return false;
};

/**
 * Render the fish
 * @param {Bodies} bodies The bodies renderer
 * @param {Number} time The interpolation factor
 */
Fish.prototype.render = function(bodies, time) {
    if (this.mated > this.mateTimeout)this.body.render(bodies, this.size * 1.5, time);
    this.body.render(bodies, this.size, time);
};

/**
 * Free all resources maintained by this fish
 * @param {Atlas} atlas The texture atlas
 */
Fish.prototype.free = function(atlas) {
    this.body.free(atlas);
};