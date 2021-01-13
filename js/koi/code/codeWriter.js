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
 * Write
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
    // TODO: Combine arcs to reduce breaks
    this.iterate((color, radiusInner, radiusOuter, aStart, aEnd) => {
        const fillColor = colors[color % colorCount];

        if (fillColor === this.QUADBITS[0])
            return true;

        context.fillStyle = fillColor.toHex();
        context.beginPath();
        context.arc(this.RADIUS, this.RADIUS, radiusInner, aStart, aEnd);
        context.arc(this.RADIUS, this.RADIUS, radiusOuter, aEnd, aStart, true);
        context.closePath();
        context.fill();

        return true;
    });

    return canvas;
};