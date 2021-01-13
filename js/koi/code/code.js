/**
 * Fish code
 * @constructor
 */
const Code = function() {

};

Code.prototype.RING_WIDTH = 10;
Code.prototype.RINGS = 4;
Code.prototype.INNER_RADIUS = 128;
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
        const steps = Math.round(Math.PI * (radiusInner + radiusOuter) / this.RING_WIDTH);
        const stepOffset = -.5 * (ring & 1);

        for (let step = 0; step < steps; ++step) {
            const aStart = Math.PI * 2 * (step + stepOffset) / steps;
            const aEnd = Math.PI * 2 * (step + stepOffset + 1) / steps;

            if (!onIteration(iteration++, radiusInner, radiusOuter, aStart, aEnd))
                return;
        }
    }
};