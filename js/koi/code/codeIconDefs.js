/**
 * Code icon SVG definitions
 * @param {HTMLElement} defs The defs element to populate
 * @constructor
 */
const CodeIconDefs = function(defs) {
    this.makeIcon(defs);
};

CodeIconDefs.prototype = Object.create(CodeIconConstants.prototype);
CodeIconDefs.prototype.SEGMENT_WIDTH = .7;
CodeIconDefs.prototype.INSET = .4;

/**
 * Make the code icon pattern
 * @param {HTMLElement} defs The defs element to populate
 */
CodeIconDefs.prototype.makeIcon = function(defs) {
    const icon = SVG.createPattern();
    const steps = (Math.round(Math.PI * 2 / this.SEGMENT_WIDTH) >> 1) << 1;
    const center = SVG.createCircle(this.RADIUS, this.RADIUS, this.RADIUS * (1 - this.INSET));

    for (let step = 0; step < steps; step += 1) {
        const aStart = Math.PI * 2 * step / steps;
        const aEnd = aStart + Math.PI * 2 / steps;
        const path = SVG.createPath([
            "M",
            this.RADIUS + Math.cos(aStart) * this.RADIUS,
            this.RADIUS + Math.sin(aStart) * this.RADIUS,
            "A",
            this.RADIUS,
            this.RADIUS,
            0,
            0,
            1,
            this.RADIUS + Math.cos(aEnd) * this.RADIUS,
            this.RADIUS + Math.sin(aEnd) * this.RADIUS,
            "L",
            this.RADIUS + Math.cos((aStart + aEnd) * .5) * this.RADIUS * (1 - this.INSET),
            this.RADIUS + Math.sin((aStart + aEnd) * .5) * this.RADIUS * (1 - this.INSET),
            "Z"
        ]);

        icon.appendChild(center);
        icon.appendChild(path);
    }

    SVG.setId(icon, this.ID);

    defs.appendChild(icon);
};