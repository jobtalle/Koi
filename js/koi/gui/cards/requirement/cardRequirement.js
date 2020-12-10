/**
 * A card requirement
 * @param {PatternFootprint} footprint The footprint to require
 * @constructor
 */
const CardRequirement = function(footprint) {
    this.footprint = footprint;
    this.lastChecked = null;
    this.lastResult = false;
};

/**
 * Check if a body matches this requirement
 * @param {FishBody} body The fish body
 */
CardRequirement.prototype.matches = function(body) {
    if (this.lastChecked !== body) {
        this.lastResult = this.footprint.matches(body.pattern);
        this.lastChecked = body;
    }
    
    return this.lastResult;
};