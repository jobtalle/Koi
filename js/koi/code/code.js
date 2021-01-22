/**
 * Fish code
 * @constructor
 */
const Code = function() {

};

Code.prototype.RING_WIDTH = 15;
Code.prototype.RINGS = 4;
Code.prototype.INNER_RADIUS = Still.prototype.RADIUS;
Code.prototype.STEPS = Math.round(Math.PI * 2 * Code.prototype.INNER_RADIUS / Code.prototype.RING_WIDTH);
Code.prototype.RADIUS = Code.prototype.RING_WIDTH * Code.prototype.RINGS + Code.prototype.INNER_RADIUS;
Code.prototype.QUADBITS = [
    Color.fromCSS("--color-code-00"),
    Color.fromCSS("--color-code-01"),
    Color.fromCSS("--color-code-10"),
    Color.fromCSS("--color-code-11")
];

/**
 * Get a checksum byte
 * @param {Uint8Array} bytes The bytes
 * @returns {Number} The checksum
 */
Code.prototype.checksum = function(bytes) {
    let checksum = 42;

    for (const byte of bytes)
        checksum ^= byte;

    return checksum;
};

/**
 * Iterate over all quad bit blocks
 * @param {Function} onIteration The callback
 */
Code.prototype.iterate = function(onIteration) {
    let iteration = 0;

    for (let ring = 0; ring < this.RINGS; ++ring) {
        const radiusInner = this.INNER_RADIUS + ring * this.RING_WIDTH;
        const radiusOuter = this.INNER_RADIUS + (ring + 1) * this.RING_WIDTH;
        const stepOffset = .5 * (ring & 1);

        for (let step = 0; step < this.STEPS; ++step) {
            if (!onIteration(
                iteration++,
                radiusInner,
                radiusOuter,
                Math.PI * 2 * (step + stepOffset) / this.STEPS,
                Math.PI * 2 * (step + stepOffset + 1) / this.STEPS,
                true))
                return;

            if (!onIteration(
                iteration++,
                radiusInner,
                radiusOuter,
                Math.PI * 2 * (step + stepOffset + .5) / this.STEPS,
                Math.PI * 2 * (step + stepOffset + 1.5) / this.STEPS,
                false))
                return;
        }
    }
};