/**
 * A fish
 * @param {Vector} position The initial position
 * @param {Vector} direction The initial direction
 * @constructor
 */
const Fish = function(position, direction) {
    this.position = position.copy();
    this.direction = direction.copy();
};

/**
 * Render the fish
 * @param {Renderer} renderer The renderer
 */
Fish.prototype.render = function(renderer) {
    renderer.transformPush();

    renderer.getTransform().translate(this.position.x, this.position.y);
    renderer.getTransform().rotate(this.direction.angle());

    renderer.drawLine(0, -.1, Color.BLUE, .5, 0, Color.BLUE);
    renderer.drawLine(0, .1, Color.BLUE, .5, 0, Color.BLUE);

    renderer.transformPop();
};