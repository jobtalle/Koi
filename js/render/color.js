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

Color.WHITE = new Color(1, 1, 1);

/**
 * Make a copy of this color
 * @returns {Color} A copy of the color
 */
Color.prototype.copy = function() {
    return new Color(this.r, this.g, this.b, this.a);
};

/**
 * Create an interpolated version of a color that lies between this color and a given color
 * @param {Color} other The other color
 * @param {Number} f The interpolation factor in the range [0, 1]
 * @returns {Color} The new color
 */
Color.prototype.lerp = function(other, f) {
    return new Color(
        this.r + (other.r - this.r) * f,
        this.g + (other.g - this.g) * f,
        this.b + (other.b - this.b) * f,
        this.a + (other.a - this.a) * f);
};

/**
 * Multiply this color by a scalar
 * @param {Number} n The number to multiply the color by
 * @returns {Color} The changed color
 */
Color.prototype.multiply = function(n) {
    this.r *= n;
    this.g *= n;
    this.b *= n;
    this.a *= n;

    return this;
};

/**
 * Return an array with the R, G and B values of this color
 * @returns {Number[]} The color array
 */
Color.prototype.toArrayRGB = function() {
    return [this.r, this.g, this.b];
};

/**
 * Convert the color to hexadecimal representation
 * @returns {String} The hexadecimal representation of the color
 */
Color.prototype.toHex = function() {
    const componentToHex = component => {
        const hex = component.toString(16);

        return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" +
        componentToHex(Math.round(this.r * 255)) +
        componentToHex(Math.round(this.g * 255)) +
        componentToHex(Math.round(this.b * 255));
};

/**
 * Make a color from a CSS variable
 * @param name
 */
Color.fromCSS = function(name) {
    const value = StyleUtils.get(name);

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