/**
 * A color
 * @param {Number} r A red value in the range [0, 1]
 * @param {Number} g A green value in the range [0, 1]
 * @param {Number} b A blue value in the range [0, 1]
 * @param {Number} [a] A alpha value in the range [0, 1]
 * @constructor
 */
const Color = function(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

Color.RED = new Color(1, 0, 0);
Color.GREEN = new Color(0, 1, 0);
Color.BLUE = new Color(0, 0, 1);
Color.BLACK = new Color(0, 0, 0);
Color.WHITE = new Color(1, 1, 1);