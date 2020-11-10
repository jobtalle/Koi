/**
 * A single sided page with cards
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @constructor
 */
const CardPage = function(direction) {
    this.cards = new Array(4).fill(null);
    this.element = this.createElement(direction);
    this.slots = this.createSlots(this.element);
    this.overlay = this.createOverlay(this.element, direction);
    this.rect = null;
    this.targets = null;
    this.direction = direction;
    this.cardWidth = 0;
};

CardPage.prototype.CLASS = "page";
CardPage.prototype.CLASS_SLOT = "slot";
CardPage.prototype.CLASS_LEFT = "left";
CardPage.prototype.CLASS_RIGHT = "right";
CardPage.prototype.CLASS_VISIBLE = "visible";
CardPage.prototype.CLASS_OVERLAY = "overlay";
CardPage.prototype.SHADE_OPACITY = StyleUtils.getFloat("--book-page-shade-opacity");
CardPage.prototype.PAGE_SKEW = -StyleUtils.getFloat("--book-page-skew");

/**
 * Deserialize this card page
 * @param {BinBuffer} buffer A buffer to deserialize from
 * @param {Cards} cards The cards GUI
 * @throws {RangeError} A range error if deserialized values are not valid
 */
CardPage.prototype.deserialize = function(buffer, cards) {
    const occupied = buffer.readUint8();

    for (let card = 0; card < 4; ++card) if (occupied & (1 << card)) {
        this.cards[card] = Card.deserialize(buffer);

        cards.registerCard(
            this.cards[card],
            false,
            this.element.classList.contains(this.CLASS_VISIBLE));

        this.slots[card].appendChild(this.cards[card].element);
        this.cards[card].transformSlot(this.cardWidth);
    }
};

/**
 * Serialize this card page
 * @param {BinBuffer} buffer A buffer to serialize to
 */
CardPage.prototype.serialize = function(buffer) {
    buffer.writeUint8(
        this.cards[0] !== null |
        (this.cards[1] !== null) << 1 |
        (this.cards[2] !== null) << 2 |
        (this.cards[3] !== null) << 3);

    for (const card of this.cards) if (card)
        card.serialize(buffer);
};

/**
 * Make the page visible
 * @param {Cards} [cards] The cards GUI, required if the page contains any cards
 */
CardPage.prototype.show = function(cards = null) {
    this.element.classList.add(this.CLASS_VISIBLE);

    for (const card of this.cards) if (card)
        card.initialize(
            cards.koi.systems.preview,
            cards.koi.systems.atlas,
            cards.koi.systems.bodies,
            cards.koi.randomSource);
};

/**
 * Make the page invisible
 */
CardPage.prototype.hide = function() {
    this.element.classList.remove(this.CLASS_VISIBLE);
};

/**
 * Set the flip amount on this page
 * @param {Number} flip The flip amount in the range [-1, 1]
 */
CardPage.prototype.setFlip = function(flip) {
    const scale = Math.sin(flip * Math.PI * .5);
    const skew = this.direction * this.PAGE_SKEW * (1 - Math.abs(flip));

    this.element.style.transform = "scaleX(" + scale.toString() + ") skewY(" + skew.toString() + "deg)";
    this.overlay.style.opacity = ((1 - Math.abs(scale)) * this.SHADE_OPACITY).toString();
};

/**
 * Remove all flip effects
 */
CardPage.prototype.setNoFlip = function() {
    this.element.style.removeProperty("transform");
    this.element.style.removeProperty("opacity");
};

/**
 * Get this pages' rectangle
 * @returns {DOMRect} The page rectangle
 */
CardPage.prototype.getRect = function() {
    return this.element.getBoundingClientRect();
};

/**
 * Get the bounding rectangles of slot elements
 * @param {HTMLDivElement[]} slots An array of slot elements
 * @returns {DOMRect[]} An array of bounding client rects corresponding with the slots
 */
CardPage.prototype.getRects = function(slots) {
    const rects = new Array(slots.length);

    for (let rect = 0, rectCount = slots.length; rect < rectCount; ++rect)
        rects[rect] = slots[rect].getBoundingClientRect();

    return rects;
};

/**
 * Make snap targets for a set of bounding client rects
 * @param {DOMRect[]} rects An array of bounding client rectangles
 * @returns {Vector2[]} An array of snap targets corresponding with the given rectangles
 */
CardPage.prototype.makeTargets = function(rects) {
    const targets = new Array(rects.length);

    for (let rect = 0, rectCount = rects.length; rect < rectCount; ++rect)
        targets[rect] = new Vector2(
            (rects[rect].left + rects[rect].right) * .5,
            (rects[rect].top + rects[rect].bottom) * .5);

    return targets;
};

/**
 * Reset the rect & targets info after it has been invalidated
 */
CardPage.prototype.updateRect = function() {
    this.rect = this.getRect();
    this.targets = this.makeTargets(this.getRects(this.slots));
};

/**
 * Find a point to snap to
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
CardPage.prototype.findSnap = function(x, y) {
    if (this.rect === null)
        this.updateRect();

    if (x > this.rect.left &&
        x < this.rect.right &&
        y > this.rect.top &&
        y < this.rect.bottom) {
        const horizontal = x > (this.rect.right + this.rect.left) * .5;
        const vertical = y > (this.rect.bottom + this.rect.top) * .5;
        const index = horizontal + (vertical << 1);

        if (this.cards[index])
            return null;

        return this.targets[index];
    }

    return null;
};

/**
 * Try to add a card to this page
 * @param {Card} card A card
 * @param {Vector2} snap A snap position
 * @returns {Boolean} True if the card was added, false if the snap position is not on this page
 */
CardPage.prototype.addCard = function(card, snap) {
    for (let target = 0, targets = this.targets.length; target < targets; ++target) {
        if (snap === this.targets[target]) {
            this.slots[target].appendChild(card.element);
            this.cards[target] = card;

            card.transformSlot(this.cardWidth);

            return true;
        }
    }

    return false;
};

/**
 * Try to remove a card from this page
 * @param {Card} card A card
 * @returns {Boolean} True if the card was removed from this page, false if the card is not on this page
 */
CardPage.prototype.removeCard = function(card) {
    const index = this.cards.indexOf(card);

    if (index === -1)
        return false;

    if (this.rect === null)
        this.updateRect();

    card.setPosition(this.targets[index]);

    this.cards[index] = null;
    this.slots[index].removeChild(card.element);

    return true;
};

/**
 * Create a page element
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @returns {HTMLDivElement} The element
 */
CardPage.prototype.createElement = function(direction) {
    const element = document.createElement("div");

    element.className = this.CLASS;

    if (direction === -1)
        element.classList.add(this.CLASS_LEFT);
    else
        element.classList.add(this.CLASS_RIGHT);

    return element;
};

/**
 * Create the card slots
 * @param {HTMLDivElement} element The page element
 * @returns {HTMLDivElement[]} The card slot elements
 */
CardPage.prototype.createSlots = function(element) {
    const slots = new Array(4);

    for (let slot = 0; slot < 4; ++slot) {
        const slotElement = document.createElement("div");

        slotElement.className = this.CLASS_SLOT;

        slots[slot] = slotElement;

        element.appendChild(slotElement);
    }

    return slots;
};

/**
 * Create the shading overlay for this page
 * @param {HTMLDivElement} element The page element
 * @param {Number} direction The direction of the page from the book center, -1 or 1
 * @returns {HTMLDivElement} The overlay element
 */
CardPage.prototype.createOverlay = function(element, direction) {
    const overlay = document.createElement("div");

    overlay.className = this.CLASS_OVERLAY;

    if (direction === -1)
        overlay.classList.add(this.CLASS_LEFT);
    else
        overlay.classList.add(this.CLASS_RIGHT);

    element.appendChild(overlay);

    return overlay;
};

/**
 * Fit the card page contents to a given resolution
 * @param {Number} cardWidth The card width in pixels
 * @param {Number} cardHeight The card height in pixels
 * @param {Number} cardPadding The card padding in pixels
 */
CardPage.prototype.fit = function(cardWidth, cardHeight, cardPadding) {
    this.cardWidth = cardWidth;
    this.element.style.width = (cardWidth * 2 + cardPadding * 3) + "px";
    this.element.style.height = (cardHeight * 2 + cardPadding * 3) + "px";

    for (let slot = 0; slot < 4; ++slot) {
        this.slots[slot].style.width = cardWidth + "px";
        this.slots[slot].style.height = cardHeight + "px";

        if (this.cards[slot])
            this.cards[slot].transformSlot(cardWidth);
    }

    this.rect = null;
};