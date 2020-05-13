/**
 * A fish
 * @param {Body} body The fish body
 * @param {Vector2} position The initial position
 * @param {Vector2} direction The initial direction vector, which must be normalized
 * @constructor
 */
const Fish = function(body, position, direction) {
    this.position = position.copy();
    this.positionPrevious = position.copy();
    this.direction = direction.copy();
    this.velocity = direction.copy();
    this.body = body;
    this.speed = this.SPEED_MIN;
    this.boost = 0;
    this.turnDirection = new Vector2();
    this.turnForce = 0;
    this.nibbleTime = this.NIBBLE_TIME_MIN;

    this.body.initializeSpine(position, direction);
};

Fish.prototype.FORCE_CONSTRAINT = .5;
Fish.prototype.FORCE_REPULSION  = .25;
Fish.prototype.FORCE_ALIGNMENT = .04;
Fish.prototype.FORCE_ATTRACTION = .05;
Fish.prototype.RADIUS_REPULSION = .8;
Fish.prototype.RADIUS_ALIGNMENT = 1.25;
Fish.prototype.RADIUS_ATTRACTION = 1.5;
Fish.prototype.NIBBLE_TIME_MIN = 20;
Fish.prototype.NIBBLE_TIME_MAX = 40;
Fish.prototype.NIBBLE_RADIUS = .1;
Fish.prototype.NIBBLE_DISPLACEMENT = 0.5;
Fish.prototype.NIBBLE_TURN_FORCE = .07;
Fish.prototype.SPEED_MIN = .015;
Fish.prototype.SPEED_NIBBLE = .0155;
Fish.prototype.SPEED_SLOW = .04;
Fish.prototype.SPEED_DROP = .06;
Fish.prototype.SPEED_DECAY = .996;
Fish.prototype.SPEED_CATCH_UP = .0045;
Fish.prototype.BOOST_CHANCE = .0025;
Fish.prototype.BOOST_POWER = .0015;
Fish.prototype.BOOST_MIN = 5;
Fish.prototype.BOOST_MAX = 30;
Fish.prototype.TURN_CHANCE = .0013;
Fish.prototype.TURN_FORCE = .06;
Fish.prototype.TURN_POWER = .4;
Fish.prototype.TURN_DECAY = .94;
Fish.prototype.TURN_THRESHOLD = .005;
Fish.prototype.TURN_CARRY = .95;
Fish.prototype.TURN_FOLLOW_CHANCE = .025;
Fish.prototype.TURN_AMPLITUDE = Math.PI * .4;

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
 * Constrain the fish within its constraint
 * @param {Constraint} constraint A constraint
 * @returns {Boolean} A boolean indicating whether the fish left the scene
 */
Fish.prototype.constrain = function(constraint) {
    const proximity = constraint.sample(this.position);

    if (proximity > 0) {
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
 * Update the fish
 * @param {Constraint} constraint A constraint
 * @param {WaterPlane} water A water plane to disturb
 * @param {Random} random A randomizer
 * @returns {Boolean} A boolean indicating whether the fish left the scene
 */
Fish.prototype.update = function(constraint, water, random) {
    if (this.constrain(constraint))
        return true;

    if (this.turnDirection)
        this.applyTurn();

    this.speed *= this.SPEED_DECAY;

    if (this.speed < this.SPEED_MIN)
        this.speed = this.SPEED_MIN;

    if (this.boost) {
        --this.boost;
        this.speed += this.BOOST_POWER;
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

            const turnForce = 2 * (Math.random() - .5) * this.NIBBLE_TURN_FORCE;

            this.velocity.x += this.direction.y * turnForce;
            this.velocity.y -= this.direction.x * turnForce;
            this.velocity.normalize();
        }
    }
    this.positionPrevious.set(this.position);
    this.position.add(this.velocity.multiply(this.speed));
    this.body.update(this.position, this.direction, this.speed, water);

    return false;
};

/**
 * Render the fish
 * @param {Primitives} primitives The primitives renderer
 * @param {Number} time The interpolation factor
 */
Fish.prototype.render = function(primitives, time) {
    this.body.render(primitives, time);
};

/**
 * Free all resources maintained by this fish
 * @param {Atlas} atlas The texture atlas
 */
Fish.prototype.free = function(atlas) {
    this.body.free(atlas);
};