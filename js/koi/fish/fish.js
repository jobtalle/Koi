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
    const angle = Math.atan2(vy, vx);

    renderer.transformPush();

    renderer.getTransform().translate(x, y);
    renderer.getTransform().rotate(angle);

    renderer.drawLine(0, -.1, Color.BLUE, .5, 0, Color.BLUE);
    renderer.drawLine(0, .1, Color.BLUE, .5, 0, Color.BLUE);
    renderer.drawLine(0, -.1, Color.BLUE, 0, .1, Color.BLUE);

    renderer.transformPop();
};