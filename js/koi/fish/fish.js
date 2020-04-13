/**
 * A fish
 * @param {Vector} position The initial position
 * @param {Vector} direction The initial direction vector, which must be normalized
 * @constructor
 */
const Fish = function(position, direction) {
    this.position = position.copy();
    this.positionPrevious = position.copy();
    this.velocity = direction.copy();
    this.velocityPrevious = direction.copy();
    this.speed = .03;
};

/**
 * Update the fish
 */
Fish.prototype.update = function() {
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

    renderer.drawLine(-.25, -.1, Color.BLACK, .25, 0, Color.BLACK);
    renderer.drawLine(-.25, .1, Color.BLACK, .25, 0, Color.BLACK);
    renderer.drawLine(-.25, -.1, Color.BLACK, -.25, .1, Color.BLACK);

    renderer.transformPop();
};