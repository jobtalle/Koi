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
    this.body = new Body(1, .4, position, direction);
    this.speed = this.SPEED_MIN;
    this.boost = 0;
};

Fish.prototype.FORCE_CONSTRAINT = .5;
Fish.prototype.FORCE_REPULSION  = .7;
Fish.prototype.FORCE_ALIGNMENT = .03;
Fish.prototype.FORCE_ATTRACTION = .015;
Fish.prototype.RADIUS_REPULSION = 1;
Fish.prototype.RADIUS_ALIGNMENT = 1.5;
Fish.prototype.RADIUS_ATTRACTION = 2;
Fish.prototype.POWER_REPULSION = 2.5;
Fish.prototype.FOV = Math.PI * .6;
Fish.prototype.SPEED_MIN = .01;
Fish.prototype.SPEED_SLOW = .02;
Fish.prototype.SPEED_DECAY = .995;
Fish.prototype.SPEED_CATCH_UP = .005;
Fish.prototype.BOOST_CHANCE = .003;
Fish.prototype.BOOST_POWER = .0008;
Fish.prototype.BOOST_MIN = 15;
Fish.prototype.BOOST_MAX = 65;

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
            const proximity = Math.pow(1 - distance / this.RADIUS_REPULSION, this.POWER_REPULSION);
            const fx = proximity * this.FORCE_REPULSION * dx / distance;
            const fy = proximity * this.FORCE_REPULSION * dy / distance;

            this.velocity.x += this.speed * fx;
            this.velocity.y += this.speed * fy;
            other.velocity.x -= other.speed * fx;
            other.velocity.y -= other.speed * fy;
        }
        else if (distance < this.RADIUS_ALIGNMENT) {
            const myVelocity = this.velocity.length();
            const otherVelocity = other.velocity.length();

            this.velocity.x += this.speed * this.FORCE_ALIGNMENT * other.velocity.x / otherVelocity;
            this.velocity.y += this.speed * this.FORCE_ALIGNMENT * other.velocity.y / otherVelocity;
            other.velocity.x += other.speed * this.FORCE_ALIGNMENT * this.velocity.x / myVelocity;
            other.velocity.y += other.speed * this.FORCE_ALIGNMENT * this.velocity.y / myVelocity;
        }
        else {
            const proximity = (distance - this.RADIUS_ALIGNMENT) / (this.RADIUS_ATTRACTION - this.RADIUS_ALIGNMENT);
            const fx = dx / distance;
            const fy = dy / distance;
            let velocityLength = this.velocity.length();
            let vx = this.velocity.x / velocityLength;
            let vy = this.velocity.y / velocityLength;

            if (Math.acos(-fx * vx - fy * vy) < this.FOV) {
                this.velocity.x -= proximity * this.speed * this.FORCE_ATTRACTION * fx;
                this.velocity.y -= proximity * this.speed * this.FORCE_ATTRACTION * fy;
                this.view = true;
            }

            velocityLength = other.velocity.length();
            vx = other.velocity.x / velocityLength;
            vy = other.velocity.y / velocityLength;

            if (Math.acos(fx * vx + fy * vy) < this.FOV) {
                other.velocity.x += proximity * other.speed * this.FORCE_ATTRACTION * fx;
                other.velocity.y += proximity * other.speed * this.FORCE_ATTRACTION * fy;
                other.view = true;
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
    this.body.update(this.position);
};

/**
 * Render the fish
 * @param {Renderer} renderer The renderer
 * @param {Number} time The interpolation factor
 */
Fish.prototype.render = function(renderer, time) {
    const x = this.positionPrevious.x + (this.position.x - this.positionPrevious.x) * time;
    const y = this.positionPrevious.y + (this.position.y - this.positionPrevious.y) * time;
    const vx = this.velocityPrevious.x + (this.velocity.x - this.velocityPrevious.x) * time;
    const vy = this.velocityPrevious.y + (this.velocity.y - this.velocityPrevious.y) * time;
    const angle = Math.atan2(-vy, vx);

    // renderer.transformPush();
    //
    // renderer.getTransform().translate(x, y);
    // renderer.getTransform().rotate(angle);
    //
    // let color = Color.BLACK;
    //
    // if (this.view)
    //     color = Color.WHITE;
    //
    // renderer.drawLine(-.25, -.1, color, .25, 0, color);
    // renderer.drawLine(-.25, .1, color, .25, 0, color);
    // renderer.drawLine(-.25, -.1, color, -.25, .1, color);
    //
    // renderer.transformPop();

    this.body.render(renderer, time);
};