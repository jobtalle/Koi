/**
 * A circle constraint
 * @param {Vector} position The center position
 * @param {Number} radius The circle radius
 * @constructor
 */
const Circle = function(position, radius) {
    this.position = position;
    this.radius = radius;

    Constraint.call(this, 32);
};

Circle.prototype = Object.create(Constraint.prototype);

/**
 * Draw the circle
 * @param {Renderer} renderer The renderer
 */
Circle.prototype.render = function(renderer) {
    let x, y, xp, yp;

    for (let i = 0; i <= 64; ++i) {
        const angle = Math.PI * 2 * i / 64;

        xp = x;
        yp = y;
        x = this.position.x + Math.cos(angle) * this.radius;
        y = this.position.y + Math.sin(angle) * this.radius;

        if (i !== 0)
            renderer.drawLine(xp, yp, Color.WHITE, x, y, Color.WHITE);
    }
};