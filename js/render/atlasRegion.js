/**
 * A region on the texture atlas
 * @param {Vector2} slot The atlas slot
 * @param {Vector2} slotSize The atlas slot size
 * @constructor
 */
const AtlasRegion = function(slot, slotSize) {
    this.slot = slot;
    this.vStart = slot.y;
    this.vEnd = slot.y + slotSize.y;
    this.uBodyStart = slot.x;
    this.uBodyEnd = slot.x + slotSize.x;
    this.uFinStart = this.uBodyEnd;
    this.uFinEnd = this.uBodyEnd + slotSize.x / Atlas.prototype.RATIO;
};