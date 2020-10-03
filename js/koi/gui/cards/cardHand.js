/**
 * A hand of cards
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @constructor
 */
const CardHand = function(width, height) {
    this.width = width;
    this.height = height;
    this.cards = [];
    this.targets = null;
};

CardHand.prototype.INTERPOLATION_FACTOR = .5;
CardHand.prototype.CAPACITY = 8;

/**
 * Resize the hand GUI
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 */
CardHand.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;
    this.targets = this.makeTargets(this.cards.length);
};

/**
 * Check whether this hand is full
 * @returns {Boolean} True if the hand is full
 */
CardHand.prototype.isFull = function() {
    return this.cards.length === this.CAPACITY;
};

/**
 * Check whether the hand contains a given card
 * @param {Card} card The card
 * @returns {Boolean} True if the card is in this hand
 */
CardHand.prototype.contains = function(card) {
    return this.cards.indexOf(card) !== -1;
};

/**
 * Make card position targets
 * @param {Number} count The card count
 * @returns {Vector2[]} The targets
 */
CardHand.prototype.makeTargets = function(count) {
    const targets = new Array(count);

    for (let target = 0; target < count; ++target)
        targets[target] = new Vector2(target * this.width / count, this.height * .8);

    return targets;
};

/**
 * Update the card hand GUI
 */
CardHand.prototype.update = function() {
    for (let card = 0, cards = this.cards.length; card < cards; ++card) {
        const dx = this.targets[card].x - this.cards[card].position.x;
        const dy = this.targets[card].y - this.cards[card].position.y;

        this.cards[card].move(
            dx * this.INTERPOLATION_FACTOR,
            dy * this.INTERPOLATION_FACTOR);
    }
};

/**
 * Render the card hand GUI
 * @param {Number} time The amount of time since the last update
 */
CardHand.prototype.render = function(time) {
    for (const card of this.cards)
        card.render(time);
};

/**
 * Add a card to the hand
 * @param {Card} card A card
 */
CardHand.prototype.add = function(card) {
    this.cards.push(card);
    this.targets = this.makeTargets(this.cards.length);
};

/**
 * Remove a card from the hand
 * @param {Card} card A card
 */
CardHand.prototype.remove = function(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    this.targets = this.makeTargets(this.cards.length);
};