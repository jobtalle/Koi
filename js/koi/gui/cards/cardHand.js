/**
 * A hand of cards
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @param {HTMLDivElement} dropTarget A card drop target that is hidden by default
 * @constructor
 */
const CardHand = function(width, height, dropTarget) {
    this.dropTarget = dropTarget;
    this.cards = [];
    this.targets = null;
    this.visible = true;
    this.dropTargetVisible = false;
    this.fanCenter = new Vector2();
    this.fanAngle = 0;
    this.fanRadius = 0;

    this.calculateFan(width, height);
};

CardHand.prototype.WIDTH = .5;
CardHand.prototype.HEIGHT = .3;
CardHand.prototype.RAISE = StyleUtils.getFloat("--card-drop-target-raise");
CardHand.prototype.INTERPOLATION_FACTOR = .5;
CardHand.prototype.MAX_SPACING = .8;
CardHand.prototype.EXTRA_ANGLE = -.03;
CardHand.prototype.HIDE_HEIGHT = 1;
CardHand.prototype.CLASS_DROP_TARGET_HIDDEN = "hidden";
CardHand.prototype.DROP_TARGET_TRIGGER_DISTANCE = Card.prototype.WIDTH;
CardHand.prototype.CAPACITY = 16;
CardHand.prototype.FAN_PORTION_MAX = 1;

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
        const position = this.targets[card].vector2();

        position.y += Card.prototype.HEIGHT * this.HIDE_HEIGHT;

        const deserialized = Card.deserialize(buffer, position, this.targets[card].z);

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
 * Calculate the fan shape
 * @param {Number} width The view width in pixels
 * @param {Number} height The view height in pixels
 */
CardHand.prototype.calculateFan = function(width, height) {
    const handWidth = width * this.WIDTH;
    const handHeight = Card.prototype.HEIGHT * this.HEIGHT;

    this.fanAngle = Math.PI - Math.atan(.5 * handWidth / handHeight) - Math.atan(handHeight / .5 * handWidth);
    this.fanRadius = 0.5 * handWidth / Math.sin(this.fanAngle);
    this.fanCenter.x = width * .5;
    this.fanCenter.y = height + (-.5 - this.RAISE) * Card.prototype.HEIGHT + this.fanRadius;
};

/**
 * Check if this hand is full
 * @returns {Boolean} True if the hand is full
 */
CardHand.prototype.isFull = function() {
    return this.cards.length === this.CAPACITY;
};

/**
 * Resize the hand GUI
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 */
CardHand.prototype.resize = function(width, height) {
    this.calculateFan(width, height);

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
 * Calculate amount of radians for the card fan for a given number of cards
 * @param {Number} count The number of cards in the hand
 * @returns {Number}
 */
CardHand.prototype.calculateFanPortion = function(count) {
    return Math.min(
        this.FAN_PORTION_MAX,
        (count - 1) / ((2 * this.fanAngle * this.fanRadius) / (Card.prototype.WIDTH * this.MAX_SPACING)));
};

/**
 * Make card position targets
 * @param {Number} count The card count
 * @returns {Vector3[]} The targets
 */
CardHand.prototype.makeTargets = function(count) {
    const extraAngle = count === 1 ? 0 : this.EXTRA_ANGLE;
    const targets = new Array(count);
    const fanPortion = this.calculateFanPortion(count);

    for (let target = 0; target < count; ++target) {
        const factor = 1 - (count === 1 ? 0.5 : target / (count - 1));
        const angle = fanPortion * this.fanAngle * (1 - 2 * factor) - Math.PI * .5;

        targets[target] = new Vector3(
            this.fanCenter.x + Math.cos(angle) * this.fanRadius,
            this.fanCenter.y + Math.sin(angle) * this.fanRadius,
            fanPortion * this.fanAngle * (1 - 2 * factor) + extraAngle);
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

    card.positionPrevious.set(card.position);
};

/**
 * Clear the card hand
 * @param {Cards} cards The cards
 */
CardHand.prototype.clear = function(cards) {
    for (const card of this.cards)
        cards.remove(card);

    this.cards = [];
};

/**
 * Get the distance to the drop target
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 * @returns {Number} The distance to the drop target
 */
CardHand.prototype.distanceToDropTarget = function(x, y) {
    const rect = this.dropTarget.getBoundingClientRect();
    const dx = x > rect.left && x < rect.right ? 0 : Math.min(
        Math.abs(rect.left - x),
        Math.abs(x - rect.right));
    const dy = y > rect.top && y < rect.bottom ? 0 : Math.min(
        Math.abs(rect.top - y),
        Math.abs(y - rect.bottom));

    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Check whether a position is outside the fan shape
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 * @returns {Boolean} True if the given position is outside the card hand
 */
CardHand.prototype.isOutside = function(x, y) {
    const dx = this.fanCenter.x - x;
    const dy = this.fanCenter.y - y;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (d > this.fanRadius + Card.prototype.HEIGHT)
        return true;

    const fanPortion = this.calculateFanPortion(this.cards.length);

    return Math.abs(Math.acos(dy / d)) > fanPortion * this.fanAngle + Card.prototype.WIDTH / this.fanRadius;
};

/**
 * Move a draggable item around
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
CardHand.prototype.moveDraggable = function(x, y) {
    if (this.dropTargetVisible) {
        if (this.distanceToDropTarget(x, y) > this.DROP_TARGET_TRIGGER_DISTANCE) {
            this.dropTargetVisible = false;
            this.dropTarget.classList.add(this.CLASS_DROP_TARGET_HIDDEN);
        }
    }
    else if (!this.isFull() && this.distanceToDropTarget(x, y) < this.DROP_TARGET_TRIGGER_DISTANCE) {
        this.dropTargetVisible = true;
        this.dropTarget.classList.remove(this.CLASS_DROP_TARGET_HIDDEN);
    }
};

/**
 * Show the card hand GUI
 */
CardHand.prototype.show = function() {
    this.visible = true;
    this.dropTarget.classList.add(this.CLASS_DROP_TARGET_HIDDEN);
    this.dropTargetVisible = false;
};

/**
 * Hide the card hand GUI
 */
CardHand.prototype.hide = function() {
    this.visible = false;
};