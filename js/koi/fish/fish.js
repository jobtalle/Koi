/**
 * A fish
 * @param {Vector} position The initial position
 * @param {Vector} direction The initial direction vector, which must be normalized
 * @param {Object} constraint The constraint in which this fish lives
 * @constructor
 */
const Fish = function(position, direction, constraint) {
    this.position = position.copy();
    this.positionPrevious = position.copy();
    this.direction = direction.copy();
    this.velocity = direction.copy();
    this.velocityPrevious = direction.copy();
    this.constraint = constraint;
    this.body = new Body(1.1, .25, position, direction);
    this.speed = this.SPEED_MIN;
    this.boost = 0;
};

Fish.prototype.FORCE_CONSTRAINT = .5;
Fish.prototype.FORCE_REPULSION  = .25;
Fish.prototype.FORCE_ALIGNMENT = .03;
Fish.prototype.FORCE_ATTRACTION = .06;
Fish.prototype.RADIUS_REPULSION = .8;
Fish.prototype.RADIUS_ALIGNMENT = 1.2;
Fish.prototype.RADIUS_ATTRACTION = 1.5;
Fish.prototype.SPEED_MIN = .03;
Fish.prototype.SPEED_SLOW = .07;
Fish.prototype.SPEED_DECAY = .996;
Fish.prototype.SPEED_CATCH_UP = .003;
Fish.prototype.BOOST_CHANCE = .0035;
Fish.prototype.BOOST_POWER = .001;
Fish.prototype.BOOST_MIN = 5;
Fish.prototype.BOOST_MAX = 35;

/**
 * Interact with another fish that may be in range, applying interaction to both fishes
 * @param {Fish} other Another fish
 */
Fish.prototype.interact = function(other) {
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
 */
Fish.prototype.constrain = function() {
    const proximity = this.constraint.sample(this.position);

    if (proximity !== 0) {
        const magnitude = this.FORCE_CONSTRAINT * proximity;

        if (this.velocity.dot(this.constraint.normal) < 0) {
            const speed = this.velocity.length();

            if (this.velocity.y * this.constraint.normal.x - this.velocity.x * this.constraint.normal.y > 0) {
                this.velocity.x += this.speed * this.velocity.y * magnitude / speed;
                this.velocity.y -= this.speed * this.velocity.x * magnitude / speed;
            }
            else {
                this.velocity.x -= this.speed * this.velocity.y * magnitude / speed;
                this.velocity.y += this.speed * this.velocity.x * magnitude / speed;
            }
        }
        else {
            this.velocity.x += this.speed * this.constraint.normal.x * magnitude;
            this.velocity.y += this.speed * this.constraint.normal.y * magnitude;
        }
    }
};

/**
 * Update the fish
 * @param {Random} random A randomizer
 */
Fish.prototype.update = function(random) {
    this.constrain();

    this.speed *= this.SPEED_DECAY;

    if (this.speed < this.SPEED_MIN)
        this.speed = this.SPEED_MIN;

    if (this.boost) {
        --this.boost;
        this.speed += this.BOOST_POWER;
    }

    this.direction.set(this.velocity).normalize();
    this.velocity.set(this.direction).multiply(this.speed);

    if (this.speed < this.SPEED_SLOW) {
        if (this.boost === 0 && random.getFloat() < this.BOOST_CHANCE) {
            this.boost = this.BOOST_MIN + Math.floor(random.getFloat() * (this.BOOST_MAX - this.BOOST_MIN));
        }
    }

    this.positionPrevious.set(this.position);
    this.position.add(this.velocity);
    this.body.update(this.position, this.direction, this.speed);
};

/**
 * Render the fish
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Fish.prototype.render = function(renderer, time) {
    this.body.render(renderer, time);
};