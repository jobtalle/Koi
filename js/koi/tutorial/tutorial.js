/**
 * The tutorial base class
 * @param {Overlay} overlay The overlay object to show hints on
 * @param {Boolean} [allowMutation] Indicate whether mutations are allowed while this tutorial is active
 * @param {Boolean} [forceMutation] True if at least one mutation must occur when possible during breeding
 * @param {Boolean} [handEnabled] True if the card hand is enabled
 * @constructor
 */
const Tutorial = function(
    overlay,
    allowMutation = true,
    forceMutation = true,
    handEnabled = false) {
    this.phase = 0;
    this.overlay = overlay;
    this.allowMutation = allowMutation;
    this.forceMutation = forceMutation;
    this.handEnabled = handEnabled;
};

/**
 * Advance the tutorial phase
 */
Tutorial.prototype.advance = function() {
    ++this.phase;
};

/**
 * Update the tutorial state
 * @param {Koi} koi The koi object
 * @returns {Boolean} True if the tutorial has finished
 */
Tutorial.prototype.update = function(koi) {
    return true;
};

/**
 * Render the tutorial
 * @param {Constellation} constellation The constellation
 * @param {Number} scale The scale
 * @param {Number} time The amount of time since the last update
 */
Tutorial.prototype.render = function(constellation, scale, time) {

};

/**
 * A function that is called after breeding took place
 * @param {Constellation} constellation The constellation
 * @param {Pond} pond The pond where the breeding took place
 * @param {Boolean} mutated True if a mutation occurred
 */
Tutorial.prototype.onBreed = function(constellation, pond, mutated) {

};

/**
 * A function that is called after a pattern mutation occurs
 */
Tutorial.prototype.onMutate = function() {

};

/**
 * A function that is called when a card is stored in the card book
 * @param {Card} card The card that was stored
 */
Tutorial.prototype.onStoreCard = function(card) {

};

/**
 * A function that is called when the card book unlocks a page
 */
Tutorial.prototype.onUnlock = function() {

};

/**
 * Get the whitelist of fish that may be interacted with
 * @returns {Fish[]} The whitelist of fish, or null if there is no whitelist
 */
Tutorial.prototype.getInteractionWhitelist = function() {
    return null;
};