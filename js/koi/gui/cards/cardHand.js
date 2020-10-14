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
    this.visible = true; // TODO: Invert, probably
};

CardHand.prototype.WIDTH = .5;
CardHand.prototype.HEIGHT = .3;
CardHand.prototype.RAISE = .6;
CardHand.prototype.INTERPOLATION_FACTOR = .5;
CardHand.prototype.MAX_SPACING = .8;
CardHand.prototype.EXTRA_ANGLE = -.03;
CardHand.prototype.HIDE_HEIGHT = .2;

/**
 * Deserialize the card hand
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @param {Cards} cards The cards GUI
 * @throws {RangeError} A range error if deserialized values are not valid
 */
CardHand.prototype.deserialize = function(buffer, cards) {
    const cardCount = buffer.readUint8();

    this.targets = this.makeTargets(cardCount);

    for (let card = 0; card < cardCount; ++card) {
        const deserialized = Card.deserialize(buffer, this.targets[card].vector2(), this.targets[card].z);

        this.cards.push(deserialized);

        cards.registerCard(deserialized);
    }
};

/**
 * Serialize the card hand
 * @param {BinBuffer} buffer The buffer to serialize to
 */
CardHand.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.cards.length);

    for (const card of this.cards)
        card.serialize(buffer);
};

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
 * @returns {Vector3[]} The targets
 */
CardHand.prototype.makeTargets = function(count) {
    const handWidth = this.width * this.WIDTH;
    const handHeight = Card.prototype.HEIGHT * this.HEIGHT;
    const extraAngle = count === 1 ? 0 : this.EXTRA_ANGLE;
    const fanAngle = Math.PI - Math.atan(0.5 * handWidth / handHeight) - Math.atan(handHeight / 0.5 * handWidth);
    const fanRadius = 0.5 * handWidth / Math.sin(fanAngle);
    const fanPortion = Math.min(
        1,
        (count - 1) / ((2 * fanAngle * fanRadius) / (Card.prototype.WIDTH * this.MAX_SPACING)));

    const targets = new Array(count);

    for (let target = 0; target < count; ++target) {
        const factor = 1 - (count === 1 ? 0.5 : target / (count - 1));
        const angle = fanPortion * fanAngle * (1 - 2 * factor) - Math.PI * .5;

        targets[target] = new Vector3(
            this.width * .5 + Math.cos(angle) * fanRadius,
            this.height + (.5 - this.RAISE) * Card.prototype.WIDTH + fanRadius + Math.sin(angle) * fanRadius,
            fanPortion * fanAngle * (1 - 2 * factor) + extraAngle);
    }

    return targets;
};

/**
 * Update the card hand GUI
 */
CardHand.prototype.update = function() {
    const yShift = this.visible ? 0 : this.HIDE_HEIGHT * Card.prototype.HEIGHT;

    for (let card = 0, cards = this.cards.length; card < cards; ++card) {
        this.cards[card].move(this.targets[card].x, this.targets[card].y + yShift, this.INTERPOLATION_FACTOR);
        this.cards[card].rotate(this.targets[card].z, this.INTERPOLATION_FACTOR);
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
 * @param {Boolean} insert True if the card should be inserted at its nearest suitable position
 * @returns {Number} The card index after insertion
 */
CardHand.prototype.add = function(card, insert = true) {
    this.targets = this.makeTargets(this.cards.length + 1);

    if (insert) {
        let nearest = -1;
        let nearestDistance = Number.MAX_VALUE;

        for (let target = 0, targetCount = this.targets.length; target < targetCount; ++target) {
            const dx = card.position.x - this.targets[target].x;
            const dy = card.position.y - this.targets[target].y;
            const distance = dx * dx + dy * dy;

            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearest = target;
            }
        }

        if (nearest === -1) {
            this.cards.push(card);

            return 1;
        }
        else {
            this.cards.splice(nearest, 0, card);

            return nearest + 1;
        }
    }
    else {
        this.cards.push(card);

        return this.cards.length;
    }
};

/**
 * Insert all cards after a given index
 * @param {HTMLDivElement} parent The parent element containing all cards
 * @param {Number} index The index of the first card to be re-added
 */
CardHand.prototype.addCardsAfter = function(parent, index) {
    for (let card = index, cards = this.cards.length; card < cards; ++card) {
        parent.removeChild(this.cards[card].element);
        parent.appendChild(this.cards[card].element);
    }
};

/**
 * Remove a card from the hand
 * @param {Card} card A card
 */
CardHand.prototype.remove = function(card) {
    this.cards.splice(this.cards.indexOf(card), 1);
    this.targets = this.makeTargets(this.cards.length);
};

/**
 * Clear the card hand
 */
CardHand.prototype.clear = function() {
    this.cards = [];
};

/**
 * Show the card hand GUI
 */
CardHand.prototype.show = function() {
    this.visible = true;
};

/**
 * Hide the card hand GUI
 */
CardHand.prototype.hide = function() {
    this.visible = false;
};