/**
 * A code writer
 * @param {FishBody} body A fish body to encode
 * @param {Still} still The still icon renderer
 * @param {Atlas} atlas The atlas
 * @param {Bodies} bodies The bodies renderer
 * @param {RandomSource} randomSource The random source
 * @constructor
 */
const CodeWriter = function(body, still, atlas, bodies, randomSource) {
    atlas.write(body.pattern, randomSource);

    this.icon = still.render(body, atlas, bodies);
    this.bytes = this.toBytes(body);

    body.pattern.free(atlas);
};

CodeWriter.prototype = Object.create(Code.prototype);
CodeWriter.prototype.KEY_TITLE_TOP = "TITLE_TOP";
CodeWriter.prototype.KEY_TITLE_BOTTOM = "TITLE_BOTTOM";
CodeWriter.prototype.FONT_SIZE = StyleUtils.getInt("--code-font-size");
CodeWriter.prototype.FONT_HEIGHT = StyleUtils.getInt("--code-font-height");
CodeWriter.prototype.FONT_PADDING = StyleUtils.getInt("--code-font-padding");
CodeWriter.prototype.FONT_SPACING_BASE = StyleUtils.getFloat("--code-font-spacing-base");
CodeWriter.prototype.FONT_SPACING_TOP = StyleUtils.getFloat("--code-font-spacing-top");
CodeWriter.prototype.FONT_COLOR = Color.fromCSS("--code-font-color");

/**
 * Convert a body to bytes
 * @param {FishBody} body A fish body
 * @returns {Uint8Array} The bytes
 */
CodeWriter.prototype.toBytes = function(body) {
    const buffer = new BinBuffer();

    body.serialize(buffer);

    return buffer.toByteArray();
};

/**
 * Make an array of colors to encode
 * @returns {Color[]} The array of colors encoding the body
 */
CodeWriter.prototype.makeColors = function() {
    const byteCount = this.bytes.length;
    const checksum = this.checksum(this.bytes);
    const colors = new Array((byteCount << 2) + 9);

    colors[0] = this.QUADBITS[byteCount & 3];
    colors[1] = this.QUADBITS[(byteCount >> 2) & 3];
    colors[2] = this.QUADBITS[(byteCount >> 4) & 3];
    colors[3] = this.QUADBITS[(byteCount >> 6) & 3];
    colors[4] = this.QUADBITS[(byteCount >> 8) & 3];
    colors[5] = this.QUADBITS[checksum & 3];
    colors[6] = this.QUADBITS[(checksum >> 2) & 3];
    colors[7] = this.QUADBITS[(checksum >> 4) & 3];
    colors[8] = this.QUADBITS[(checksum >> 6) & 3];

    for (let byte = 0; byte < byteCount; ++byte) {
        colors[(byte << 2) + 9] = this.QUADBITS[this.bytes[byte] & 3];
        colors[(byte << 2) + 10] = this.QUADBITS[(this.bytes[byte] >> 2) & 3];
        colors[(byte << 2) + 11] = this.QUADBITS[(this.bytes[byte] >> 4) & 3];
        colors[(byte << 2) + 12] = this.QUADBITS[(this.bytes[byte] >> 6) & 3];
    }

    return colors;
};

/**
 * Write arc shaped text
 * @param {CanvasRenderingContext2D} context The rendering context
 * @param {String} text The text
 * @param {Number} x The X center
 * @param {Number} y The Y center
 * @param {Number} radius The arc radius
 * @param {Number} angle The arc center angle
 */
CodeWriter.prototype.textArc = function(
    context,
    text,
    x,
    y,
    radius,
    angle) {
    let spacing = this.FONT_SPACING_TOP;

    if (angle > Math.PI) {
        radius -= this.FONT_HEIGHT;
        spacing = this.FONT_SPACING_BASE;
    }

    radius -= this.FONT_PADDING;

    const radians = context.measureText(text).width * spacing / radius;
    let offset = (context.measureText(text[text.length - 1]).width * (spacing - 1) / radius) * .5;

    context.save();
    context.translate(x, y);

    for (const letter of text) {
        const letterRadians = context.measureText(letter).width * spacing / radius;
        const rotationOffset = .5 * context.measureText(letter).width / radius

        context.save();

        if (angle > Math.PI) {
            context.rotate(angle - .5 * radians + offset);
            context.translate(radius, 0);
            context.rotate(Math.PI * .5 + rotationOffset);
        }
        else {
            context.rotate(angle + .5 * radians - offset);
            context.translate(radius, 0);
            context.rotate(Math.PI * 1.5 - rotationOffset);
        }

        context.fillText(letter, 0, 0);
        context.restore();

        offset += letterRadians;
    }

    context.restore();
};

/**
 * Write the code
 * @returns {HTMLCanvasElement} A canvas containing the code
 */
CodeWriter.prototype.write = function() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const colors = this.makeColors();
    const colorCount = colors.length;

    canvas.width = canvas.height = this.RADIUS << 1;

    context.save();
    context.beginPath();
    context.arc(this.RADIUS, this.RADIUS, .5 * (this.INNER_RADIUS + this.RADIUS), 0, Math.PI * 2);
    context.clip();
    context.translate(this.RADIUS - this.INNER_RADIUS, this.RADIUS - this.INNER_RADIUS);
    context.scale(1 / Still.prototype.UPSCALE, 1 / Still.prototype.UPSCALE);
    context.drawImage(this.icon, 0, 0);
    context.restore();

    context.fillStyle = this.QUADBITS[0].toHex();
    context.beginPath();
    context.arc(this.RADIUS, this.RADIUS, this.INNER_RADIUS, 0, Math.PI * 2);
    context.arc(this.RADIUS, this.RADIUS, this.RADIUS, Math.PI * 2, 0, true);
    context.closePath();
    context.fill();

    this.iterate((color, radiusInner, radiusOuter, aStart, aEnd, base) => {
        const fillColor = colors[color % colorCount];

        if (fillColor === this.QUADBITS[0])
            return true;

        context.fillStyle = fillColor.toHex();
        context.beginPath();

        if (base) {
            context.arc(this.RADIUS, this.RADIUS, radiusInner, aStart, aEnd);
            context.lineTo(
                this.RADIUS + Math.cos(.5 * (aStart + aEnd)) * radiusOuter,
                this.RADIUS + Math.sin(.5 * (aStart + aEnd)) * radiusOuter);
        }
        else {
            context.lineTo(
                this.RADIUS + Math.cos(.5 * (aStart + aEnd)) * radiusInner,
                this.RADIUS + Math.sin(.5 * (aStart + aEnd)) * radiusInner);
            context.arc(this.RADIUS, this.RADIUS, radiusOuter, aEnd, aStart, true);
        }

        context.closePath();
        context.fill();

        return true;
    });

    context.fillStyle = this.FONT_COLOR.toHex();
    context.font = "bold " + this.FONT_SIZE.toString() + "px grandstander";

    this.textArc(
        context,
        language.get(this.KEY_TITLE_TOP),
        this.RADIUS,
        this.RADIUS,
        this.INNER_RADIUS,
        Math.PI * 1.5);
    this.textArc(
        context,
        language.get(this.KEY_TITLE_BOTTOM),
        this.RADIUS,
        this.RADIUS,
        this.INNER_RADIUS,
        Math.PI * .5);

    return canvas;
};