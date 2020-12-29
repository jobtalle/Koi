/**
 * The cards tutorial
 * @param {Overlay} overlay The overlay object to show hints on
 * @constructor
 */
const TutorialCards = function(overlay) {
    Tutorial.call(this, overlay);

    this.mutations = Number.parseInt(window["localStorage"].getItem("tutorial"));
    this.pointingToDropTarget = false;
    this.cardStored = false;
    this.unlocked = false;
    this.stored = false;
    this.highlight1 = this.highlight2 = null;
};

TutorialCards.prototype = Object.create(Tutorial.prototype);
TutorialCards.prototype.PHASE_START = 0;
TutorialCards.prototype.PHASE_WAITING = 1;
TutorialCards.prototype.PHASE_CREATE_CARD = 2;
TutorialCards.prototype.PHASE_OPEN_BOOK = 3;
TutorialCards.prototype.PHASE_STORE_CARD = 4;
TutorialCards.prototype.PHASE_UNLOCK = 5;
TutorialCards.prototype.PHASE_CLOSE_BOOK = 6;
TutorialCards.prototype.MUTATIONS_REQUIRED = 3;
TutorialCards.prototype.LANG_CREATE_CARD = "TUTORIAL_CREATE_CARD";
TutorialCards.prototype.LANG_OPEN_BOOK_STORE = "TUTORIAL_OPEN_BOOK_STORE";
TutorialCards.prototype.LANG_OPEN_BOOK = "TUTORIAL_OPEN_BOOK";
TutorialCards.prototype.LANG_STORE_CARD = "TUTORIAL_STORE_CARD";
TutorialCards.prototype.LANG_UNLOCK = "TUTORIAL_UNLOCK";

/**
 * Cue the card mechanic tutorial
 */
TutorialCards.prototype.start = function() {
    this.overlay.setText(language.get(this.LANG_CREATE_CARD));

    this.phase = this.PHASE_CREATE_CARD;
    this.forceMutation = false;
    this.handEnabled = true;
};

/**
 * A function that is called after a pattern mutation occurs
 */
TutorialCards.prototype.onMutate = function() {
    if (this.mutations < this.MUTATIONS_REQUIRED) {
        window["localStorage"].setItem("tutorial", (++this.mutations).toString());

        if (this.mutations === this.MUTATIONS_REQUIRED)
            this.start();
    }
};

/**
 * A function that is called when a card is stored in the card book
 * @param {Card} card The card that was stored
 */
TutorialCards.prototype.onStoreCard = function(card) {
    this.cardStored = true;
};

/**
 * A function that is called when the card book unlocks a page
 */
TutorialCards.prototype.onUnlock = function() {
    this.unlocked = true;
};

/**
 * Point towards the drop target
 * @param {Koi} koi The koi object
 */
TutorialCards.prototype.pointToDropTarget = function(koi) {
    this.overlay.createArrow(koi.gui.cards.hand.dropTarget, "down");
};

/**
 * Point towards the book button
 * @param {Koi} koi The koi object
 */
TutorialCards.prototype.pointToBookButton = function(koi) {
    this.overlay.createArrow(koi.gui.cards.buttonBook, "left-up");
};

/**
 * Point towards the unlock button
 * @param {Koi} koi The koi object
 */
TutorialCards.prototype.pointToUnlockables = function(koi) {
    if (!this.highlight1) {
        this.highlight1 = koi.gui.overlay.createHighlightElement();
        this.highlight2 = koi.gui.overlay.createHighlightElement();

        koi.gui.cards.book.pages[1].slots[2].appendChild(this.highlight1);
        koi.gui.cards.book.pages[1].slots[3].appendChild(this.highlight2);
    }
};

/**
 * Mark the cards tutorial as finished
 * @param {Koi} koi The koi object
 */
TutorialCards.prototype.markFinished = function(koi) {
    if (this.highlight1) {
        koi.gui.cards.book.pages[1].slots[2].removeChild(this.highlight1);
        koi.gui.cards.book.pages[1].slots[3].removeChild(this.highlight2);
    }

    window["localStorage"].setItem("tutorial", (this.MUTATIONS_REQUIRED + 1).toString());
};

/**
 * Update the tutorial state
 * @param {Koi} koi The koi object
 * @returns {Boolean} True if the tutorial has finished
 */
TutorialCards.prototype.update = function(koi) {
    switch (this.phase) {
        case this.PHASE_START:
            if (this.mutations < this.MUTATIONS_REQUIRED)
                this.phase = this.PHASE_WAITING;
            else if (this.mutations === this.MUTATIONS_REQUIRED)
                this.start();
            else {
                koi.gui.cards.enableBookButton();

                return true;
            }

            break;
        case this.PHASE_CREATE_CARD:
            if (koi.gui.cards.hand.cards.length > 0) {
                this.overlay.setText(language.get(this.LANG_OPEN_BOOK_STORE));

                koi.gui.cards.enableBookButton();

                this.pointToBookButton(koi);
                this.advance();

                break;
            }

            if (this.pointingToDropTarget) {
                if (!koi.mover.move) {
                    this.overlay.deleteArrow();

                    this.pointingToDropTarget = false;
                }
            }
            else {
                if (koi.mover.move) {
                    this.pointToDropTarget(koi);

                    this.pointingToDropTarget = true;
                }
            }

            break;
        case this.PHASE_OPEN_BOOK:
            if (!this.stored && koi.gui.cards.hand.cards.length === 0 && !koi.gui.cards.grabbed) {
                this.overlay.setText(language.get(this.LANG_CREATE_CARD));

                this.pointToDropTarget(koi);

                this.phase = this.PHASE_CREATE_CARD;
            }
            else if (koi.gui.cards.bookVisible) {
                if (this.stored) {
                    this.overlay.setText(language.get(this.LANG_UNLOCK));

                    this.pointToUnlockables(koi);

                    this.phase = this.PHASE_UNLOCK;
                }
                else {
                    this.overlay.deleteArrow();
                    this.overlay.setText(language.get(this.LANG_STORE_CARD));

                    this.advance();
                }
            }

            break;
        case this.PHASE_STORE_CARD:
            if (!koi.gui.cards.bookVisible) {
                this.overlay.setText(language.get(this.LANG_OPEN_BOOK_STORE));

                this.pointToBookButton(koi);

                this.phase = this.PHASE_OPEN_BOOK;
            }
            else if (this.cardStored) {
                this.overlay.setText(language.get(this.LANG_UNLOCK));
                this.stored = true;

                this.pointToUnlockables(koi);
                this.advance();
            }

            break;
        case this.PHASE_UNLOCK:
            if (!koi.gui.cards.bookVisible || this.unlocked) {
                this.markFinished(koi);

                this.overlay.removeText();

                return true;
            }
    }

    return false;
};