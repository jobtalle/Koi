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

/**
 * Make a color from a CSS file
 * @param name
 */
Color.fromCSS = function(name) {
    const value = getComputedStyle(document.body).getPropertyValue("--color-" + name).trim();

    if (value.charAt(0) === "#") {
        const integer = parseInt(value.substr(1), 16);

        if (integer & 0xFF000000)
            return new Color(
                ((integer >> 24) & 0xFF) / 0xFF,
                ((integer >> 16) & 0xFF) / 0xFF,
                ((integer >> 8) & 0xFF) / 0xFF,
                (integer & 0xFF) / 0xFF);
        else
            return new Color(
                ((integer >> 16) & 0xFF) / 0xFF,
                ((integer >> 8) & 0xFF) / 0xFF,
                (integer & 0xFF) / 255);
    }

    // TODO: support rgba, rgb
};

Color.RED = new Color(1, 0, 0);
Color.GREEN = new Color(0, 1, 0);
Color.BLUE = new Color(0, 0, 1);
Color.BLACK = new Color(0, 0, 0);
Color.WHITE = new Color(1, 1, 1);