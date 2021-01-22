/**
 * A book with card pages
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 * @param {Cards} cards The cards object
 * @param {Function} onUnlock A function to call when a new page is unlocked
 * @constructor
 */
const CardBook = function(width, height, cards, onUnlock) {
    this.spine = this.createSpine();
    this.element = this.createElement(this.spine);
    this.width = width;
    this.height = height;
    this.page = 0;
    this.pages = this.createPages(this.page);
    this.flips = [];
    this.flipDirection = 0;
    this.buttonPageLeft = new CardPageButton(false, this.flipRight.bind(this));
    this.buttonPageRight = new CardPageButton(true, this.flipLeft.bind(this));
    this.cards = cards;
    this.onUnlock = onUnlock;
    this.unlocked = 0;
    this.invisibleTimeout = null;

    this.populateSpine();

    this.element.appendChild(this.buttonPageLeft.element);
    this.element.appendChild(this.buttonPageRight.element);

    this.fit();
    this.setButtonLockedStatus();
};

CardBook.prototype.ID = "book";
CardBook.prototype.ID_SPINE = "spine";
CardBook.prototype.CLASS_HIDDEN = "hidden";
CardBook.prototype.CLASS_INVISIBLE = "invisible";
CardBook.prototype.HIDE_TIME = StyleUtils.getFloat("--book-hide-time");
CardBook.prototype.PADDING_TOP = .05;
CardBook.prototype.PADDING_PAGE = .02;
CardBook.prototype.PADDING_CARD = .035;
CardBook.prototype.HEIGHT = .65;
CardBook.prototype.PAGE_COUNT = CardRequirements.length;

/**
 * A page flip action
 * @constructor
 */
CardBook.Flip = function() {
    this.flip = this.flipPrevious = 1;
    this.halfway = false;
};

CardBook.Flip.prototype.SPEED = .3;

/**
 * Update this flip
 * @returns {Boolean} True if the flip has finished
 */
CardBook.Flip.prototype.update = function() {
    this.flipPrevious = this.flip;

    if ((this.flip -= this.SPEED) < -1)
        this.flip = -1;

    return this.flip === this.flipPrevious;
};

/**
 * Reverse this flip
 */
CardBook.Flip.prototype.reverse = function() {
    this.flipPrevious = -this.flipPrevious;
    this.flip = -this.flip;
    this.halfway = !this.halfway;
};

/**
 * Get the page scale produced by this flip
 * @param {Number} time The time factor
 * @returns {Number} The scale factor
 */
CardBook.Flip.prototype.getScale = function(time) {
    return Math.sin((this.flipPrevious + (this.flip - this.flipPrevious) * time) * Math.PI * .5);
};

/**
 * Deserialize the card book
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @param {Cards} cards The cards GUI
 * @throws {RangeError} A range error if deserialized values are not valid
 */
CardBook.prototype.deserialize = function(buffer, cards) {
    this.unlocked = buffer.readUint8();
    this.unlocked = 100; // TODO: Debug

    for (const page of this.pages)
        page.deserialize(buffer, cards);

    this.setButtonLockedStatus();
};

/**
 * Serialize the card book
 * @param {BinBuffer} buffer The buffer to serialize to
 */
CardBook.prototype.serialize = function(buffer) {
    buffer.writeUint8(this.unlocked);

    for (const page of this.pages)
        page.serialize(buffer);
};

/**
 * Remove all cards from this book
 * @param {Cards} cards The cards
 */
CardBook.prototype.clear = function(cards) {
    this.unlocked = 0;

    for (const page of this.pages)
        page.clear(cards);

    this.setButtonLockedStatus();
};

/**
 * Add page elements to the spine
 */
CardBook.prototype.populateSpine = function() {
    let page;

    for (page = 0; page < this.PAGE_COUNT; page += 2)
        this.spine.appendChild(this.pages[page].element);

    for (--page; page >= 0; page -= 2)
        this.spine.appendChild(this.pages[page].element);
};

/**
 * Hide the book
 */
CardBook.prototype.hide = function() {
    this.element.classList.add(this.CLASS_HIDDEN);
    this.invisibleTimeout = setTimeout(() => {
        if (this.element.classList.contains(this.CLASS_HIDDEN))
            this.element.classList.add(this.CLASS_INVISIBLE);

        this.invisibleTimeout = null;
    }, this.HIDE_TIME * 1000);
};

/**
 * Show the book
 */
CardBook.prototype.show = function() {
    if (this.invisibleTimeout) {
        clearTimeout(this.invisibleTimeout);

        this.invisibleTimeout = null;
    }

    this.element.classList.remove(this.CLASS_INVISIBLE);
    this.element.classList.remove(this.CLASS_HIDDEN);
};

/**
 * Reverse any flips in progress
 */
CardBook.prototype.reverse = function() {
    for (const flip of this.flips)
        flip.reverse();

    this.flips = this.flips.reverse();
    this.page -= this.flips.length * this.flipDirection * 2;

    this.flipDirection = -this.flipDirection;

    this.setButtonLockedStatus();
};

/**
 * Check whether the next flip is locked
 * @returns {Boolean} True if the next page flip cannot be made because it's locked
 */
CardBook.prototype.nextFlipLocked = function() {
    return this.unlocked <= (this.page >> 1) - this.flips.length * this.flipDirection;
};

/**
 * Flip to the right
 */
CardBook.prototype.flipRight = function() {
    if (this.flips.length !== 0 && this.flipDirection === -1) {
        this.reverse();

        return;
    }

    if (this.page === this.flips.length * 2)
        return;

    this.pages[this.page - (this.flips.length + 1) * 2].show(this.cards);

    this.flips.push(new CardBook.Flip());
    this.flipDirection = 1;

    this.setButtonLockedStatus();
};

/**
 * Flip to the left
 */
CardBook.prototype.flipLeft = function() {
    if (this.flips.length !== 0 && this.flipDirection === 1) {
        this.reverse();

        return;
    }

    if (this.page + 2 === this.PAGE_COUNT - this.flips.length * 2 || this.nextFlipLocked())
        return;

    this.pages[this.page + this.flips.length * 2 + 3].show(this.cards);

    this.flips.push(new CardBook.Flip());
    this.flipDirection = -1;

    this.setButtonLockedStatus();
};

/**
 * Update the card book
 */
CardBook.prototype.update = function() {
    for (let flip = this.flips.length; flip-- > 0;) if (this.flips[flip].update()) {
        if (!this.flips[flip].halfway) {
            if (this.flipDirection === 1) {
                this.pages[this.page].hide();
                this.pages[this.page - 1].show(this.cards);
            }
            else {
                this.pages[this.page + 1 + 2 * flip].hide();
                this.pages[this.page + 2 + 2 * flip].show(this.cards);
            }
        }

        if (this.flipDirection === 1) {
            this.pages[this.page + 2 * flip + 1].hide();
            this.pages[this.page + 2 * flip - 1].setNoFlip();
        }
        else {
            this.pages[this.page].hide();
            this.pages[this.page + 2].setNoFlip();
        }

        this.flips.splice(flip, 1);
        this.page -= this.flipDirection * 2;
    }
};

/**
 * Render the page flips
 * @param {Number} time The amount of time since the last update
 */
CardBook.prototype.renderFlips = function(time) {
    let index = this.flipDirection === -1 ? this.page + 1 : this.page;

    for (const flip of this.flips) {
        const flipAmount = flip.flipPrevious + (flip.flip - flip.flipPrevious) * time;

        if (!flip.halfway && flipAmount < 0) {
            this.pages[index].hide();
            this.pages[index - this.flipDirection].show(this.cards);

            flip.halfway = true;
        }

        this.pages[index].setFlip(flipAmount);
        this.pages[index - this.flipDirection].setFlip(-flipAmount);

        index -= 2 * this.flipDirection;
    }
};

/**
 * Render the card book
 * @param {Number} time The amount of time since the last update
 */
CardBook.prototype.render = function(time) {
    if (this.flips.length !== 0)
        this.renderFlips(time);
};

/**
 * Get the number of requirements on a page
 * @param {Number} page The first of the two pages to check
 * @returns {Number} The number of requirements
 */
CardBook.prototype.getRequirementCount = function(page) {
    let requirements = 0;

    for (let slot = 0; slot < 4; ++slot) {
        if (CardRequirements[page][slot])
            ++requirements;

        if (CardRequirements[page + 1][slot])
            ++requirements;
    }

    return requirements;
};

/**
 * Get the number of page slots with satisfied requirements
 * @param {Number} page The first of the two pages to check
 * @returns {Number} The number of satisfied requirements
 */
CardBook.prototype.getSatisfiedRequirements = function(page) {
    return this.pages[page].getSatisfiedRequirements() + this.pages[page + 1].getSatisfiedRequirements();
};

/**
 * Update the locked status of the right page button
 */
CardBook.prototype.setButtonLockedStatus = function() {
    if (this.page - this.flips.length * 2 * this.flipDirection === this.pages.length - 2)
        this.buttonPageRight.setDisabled(true);
    else {
        this.buttonPageRight.setDisabled(false);

        if (this.nextFlipLocked()) {
            const requirementCount = this.getRequirementCount(this.page + this.flips.length * 2);
            const satisfiedRequirements = this.getSatisfiedRequirements(this.page + this.flips.length * 2);

            if (requirementCount === satisfiedRequirements) {
                ++this.unlocked;

                this.onUnlock();
                this.setButtonLockedStatus();
            }
            else
                this.buttonPageRight.setSatisfied(requirementCount, satisfiedRequirements);
        }
        else
            this.buttonPageRight.setUnlocked();
    }

    if (this.page - this.flips.length * 2 * this.flipDirection === 0)
        this.buttonPageLeft.setDisabled(true);
    else
        this.buttonPageLeft.setDisabled(false);
};

/**
 * Find a point to snap to
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 * @param {FishBody} body The body to find a snap for
 * @returns {Vector2} A snap position if applicable, null otherwise
 */
CardBook.prototype.findSnap = function(x, y, body) {
    if (this.flips.length === 0)
        return this.pages[this.page].findSnap(x, y, body) || this.pages[this.page + 1].findSnap(x, y, body);

    return null;
};

/**
 * Add a card to the book
 * @param {Card} card The card
 * @param {Vector2} snap A valid snap position obtained from one of the pages
 */
CardBook.prototype.addToBook = function(card, snap) {
    this.pages[this.page].addCard(card, snap) || this.pages[this.page + 1].addCard(card, snap);
    this.setButtonLockedStatus();
};

/**
 * Remove a card from the book
 * @param {Card} card A card
 */
CardBook.prototype.removeFromBook = function(card) {
    this.pages[this.page].removeCard(card) || this.pages[this.page + 1].removeCard(card);
    this.setButtonLockedStatus();
};

/**
 * Fit the book and its contents to the view size
 */
CardBook.prototype.fit = function() {
    const pageHeight = Math.round(this.height * this.HEIGHT * (1 - 2 * this.PADDING_PAGE));
    const cardPadding = Math.round(pageHeight * this.PADDING_CARD);
    const cardHeight = Math.round((pageHeight - 3 * cardPadding) * .5);
    const cardWidth = Math.round(cardHeight * Card.prototype.RATIO);
    const pageWidth = cardWidth * 2 + cardPadding * 3;
    const bookWidth = pageWidth * 2 + Math.round(this.height * this.HEIGHT * this.PADDING_PAGE * 2);

    this.element.style.width = bookWidth + "px";
    this.element.style.height = this.height * this.HEIGHT + "px";
    this.element.style.left = (this.width - bookWidth) * .5 + "px";
    this.element.style.top = this.height * this.PADDING_TOP + "px";
    this.spine.style.height = pageHeight + "px";

    for (const page of this.pages)
        page.fit(cardWidth, cardHeight, cardPadding);
};

/**
 * Create the initial set of pages
 * @param {Number} first The index of the first open page on the left side of the book
 * @returns {CardPage[]} The initial pages
 */
CardBook.prototype.createPages = function(first) {
    const pages = new Array(this.PAGE_COUNT);

    for (let page = 0; page < this.PAGE_COUNT; ++page) {
        pages[page] = new CardPage(((page & 1) << 1) - 1, CardRequirements[page]);

        if (page === first || page === first + 1)
            pages[page].show();
    }

    return pages;
};

/**
 * Create the book spine element
 * @returns {HTMLDivElement} The spine element
 */
CardBook.prototype.createSpine = function() {
    const element = document.createElement("div");

    element.id = this.ID_SPINE;

    return element;
};

/**
 * Create the root element for the card book GUI
 * @param {HTMLDivElement} spine The book spine element
 * @returns {HTMLDivElement} The element
 */
CardBook.prototype.createElement = function(spine) {
    const element = document.createElement("div");

    element.id = this.ID;
    element.className = this.CLASS_HIDDEN;
    element.classList.add(this.CLASS_INVISIBLE);

    element.appendChild(spine);

    return element;
};

/**
 * Resize the card book GUI
 * @param {Number} width The screen width in pixels
 * @param {Number} height The screen height in pixels
 */
CardBook.prototype.resize = function(width, height) {
    this.width = width;
    this.height = height;

    this.fit();
};