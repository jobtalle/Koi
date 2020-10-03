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
    this.cards.remove(card);
    this.targets = this.makeTargets(this.cards.length);
};