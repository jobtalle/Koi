/**
 * Slots hidden outside of the viewport
 * @param {Constellation} constellation The constellation
 * @param {Number} spacing The spacing between the slots
 * @param {Sampler} padding Radius padding
 * @param {Random} random A randomizer
 * @constructor
 */
const HiddenSlots = function(constellation, spacing, padding, random) {
    this.constellation = constellation;
    this.slots = this.makeSlots(spacing, padding, random);
};

HiddenSlots.prototype.PADDING = 2;

/**
 * Check whether a given slot is inside the bounds of the hidden slots
 * @param {Vector2} slot The slot
 * @returns {Boolean} True if the slot is within the bounds
 */
HiddenSlots.prototype.inBounds = function(slot) {
    return slot.x > 0 && slot.x < this.constellation.width &&
        slot.y > this.constellation.height && slot.y < this.constellation.height + this.PADDING &&
        !this.constellation.contains(slot.x, slot.y);
};

/**
 * Make the hidden slots of a circular shape
 * @param {Number} width The width
 * @param {Number} height The height
 * @param {Vector2} center The circle center
 * @param {Number} radius The circle radius
 * @param {Sampler} padding Radius padding
 * @param {Number} spacing The spacing between the slots
 * @param {Number} start The start in radians
 * @param {Number} end The end in radians
 * @param {Random} random A randomizer
 * @returns {Vector2[]} The slots
 */
HiddenSlots.prototype.makeSlotsArc = function(
    width,
    height,
    center,
    radius,
    padding,
    spacing,
    start,
    end,
    random) {
    const slots = [];
    const steps = (end - start) * radius / spacing;

    for (let step = 0; step < steps; ++step) {
        const slot = new Vector2().fromAngle(start + (end - start) * step / steps).multiply(
            radius + padding.sample(random.getFloat())).add(center);

        if (this.inBounds(slot))
            slots.push(slot);
    }

    return slots;
};

/**
 * Make the slots
 * @param {Number} spacing The spacing between the slots
 * @param {Sampler} padding Radius padding
 * @param {Random} random A randomizer
 * @returns {Vector2[]} The slots
 */
HiddenSlots.prototype.makeSlots = function(spacing, padding, random) {
    const slots = [
        ...this.makeSlotsArc(
            this.constellation.width,
            this.constellation.height,
            this.constellation.small.constraint.position,
            this.constellation.small.constraint.radius,
            padding,
            spacing,
            0,
            Math.PI * 2,
            random),
        ...this.makeSlotsArc(
            this.constellation.width,
            this.constellation.height,
            this.constellation.big.constraint.position,
            this.constellation.big.constraint.radius,
            padding,
            spacing,
            0,
            Math.PI * 2,
            random)
    ];

    for (const arc of this.constellation.river.constraint.arcs)
        slots.push(...this.makeSlotsArc(
            this.constellation.width,
            this.constellation.height,
            arc.center,
            arc.radius + this.constellation.river.constraint.width * .5,
            padding,
            spacing,
            arc.start,
            arc.end,
            random));

    return slots;
};