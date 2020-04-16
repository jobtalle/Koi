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
    this.velocity = direction.copy();
    this.velocityPrevious = direction.copy();
    this.constraint = constraint;
    this.speed = .03;
};

Fish.prototype.FORCE_CONSTRAINT = .005;
Fish.prototype.FORCE_REPULSION  = .007;
Fish.prototype.FORCE_ALIGNMENT = .003;
Fish.prototype.FORCE_ATTRACTION = .001;
Fish.prototype.RADIUS_REPULSION = .8;
Fish.prototype.RADIUS_ALIGNMENT = 1.2;
Fish.prototype.RADIUS_ATTRACTION = 2;
Fish.prototype.FOV = Math.PI * .5;

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

        if (distance < this.RADIUS_REPULSION) {
            const proximity = 1 - distance / this.RADIUS_REPULSION;
            const fx = proximity * this.FORCE_REPULSION * dx / distance;
            const fy = proximity * this.FORCE_REPULSION * dy / distance;

            this.velocity.x += fx;
            this.velocity.y += fy;
            other.velocity.x -= fx;
            other.velocity.y -= fy;
        }
        else if (distance < this.RADIUS_ALIGNMENT) {
            let vx = this.velocity.x + other.velocity.x;
            let vy = this.velocity.y + other.velocity.y;
            const vLength = Math.sqrt(vx * vx + vy * vy);

            vx /= vLength;
            vy /= vLength;

            this.velocity.x += vx * this.FORCE_ALIGNMENT;
            this.velocity.y += vy * this.FORCE_ALIGNMENT;
            other.velocity.x += vx * this.FORCE_ALIGNMENT;
            other.velocity.y += vy * this.FORCE_ALIGNMENT;
        }
        else {
            const proximity = (distance - this.RADIUS_ALIGNMENT) / (this.RADIUS_ATTRACTION - this.RADIUS_ALIGNMENT);
            const fx = dx / distance;
            const fy = dy / distance;
            let velocityLength = this.velocity.length();
            let vx = this.velocity.x / velocityLength;
            let vy = this.velocity.y / velocityLength;

            if (Math.acos(-fx * vx - fy * vy) < this.FOV) {
                this.velocity.x -= proximity * this.FORCE_ATTRACTION * fx;
                this.velocity.y -= proximity * this.FORCE_ATTRACTION * fy;
                this.view = true;
            }

            velocityLength = other.velocity.length();
            vx = other.velocity.x / velocityLength;
            vy = other.velocity.y / velocityLength;

            if (Math.acos(fx * vx + fy * vy) < this.FOV) {
                other.velocity.x += proximity * this.FORCE_ATTRACTION * fx;
                other.velocity.y += proximity * this.FORCE_ATTRACTION * fy;
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
                this.velocity.x += this.velocity.y * magnitude / speed;
                this.velocity.y -= this.velocity.x * magnitude / speed;
            }
            else {
                this.velocity.x -= this.velocity.y * magnitude / speed;
                this.velocity.y += this.velocity.x * magnitude / speed;
            }
        }
        else {
            this.velocity.x += this.constraint.normal.x * magnitude;
            this.velocity.y += this.constraint.normal.y * magnitude;
        }
    }
};

/**
 * Update the fish
 */
Fish.prototype.update = function() {
    this.constrain();

    this.velocity.normalize().multiply(this.speed);

    this.positionPrevious.set(this.position);
    this.position.add(this.velocity);
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

    renderer.transformPush();

    renderer.getTransform().translate(x, y);
    renderer.getTransform().rotate(angle);

    let color = Color.BLACK;

    if (this.view)
        color = Color.WHITE;

    renderer.drawLine(-.25, -.1, color, .25, 0, color);
    renderer.drawLine(-.25, .1, color, .25, 0, color);
    renderer.drawLine(-.25, -.1, color, -.25, .1, color);

    renderer.transformPop();
};