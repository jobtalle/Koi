/**
 * The cards tutorial
 * @param {Overlay} overlay The overlay object to show hints on
 * @constructor
 */
const TutorialCards = function(overlay) {
    Tutorial.call(this, overlay);

    this.mutations = Number.parseInt(localStorage.getItem("tutorial"));
};

TutorialCards.prototype = Object.create(Tutorial.prototype);
TutorialCards.prototype.PHASE_START = 0;
TutorialCards.prototype.PHASE_WAITING = 1;
TutorialCards.prototype.PHASE_CREATE_CARD = 2;
TutorialCards.prototype.MUTATIONS_REQUIRED = 3;
TutorialCards.prototype.LANG_CREATE_CARD = "TUTORIAL_CREATE_CARD";

/**
 * Cue the card mechanic tutorial
 */
TutorialCards.prototype.start = function() {
    this.overlay.setText(language.get(this.LANG_CREATE_CARD));

    this.phase = this.PHASE_CREATE_CARD;
};

/**
 * A function that is called after a pattern mutation occurs
 */
TutorialCards.prototype.onMutate = function() {
    if (this.mutations < this.MUTATIONS_REQUIRED) {
        localStorage.setItem("tutorial", (++this.mutations).toString());

        if (this.mutations === this.MUTATIONS_REQUIRED)
            this.start();
    }
};

/**
 * Update the tutorial state
 * @param {Constellation} constellation The constellation
 * @param {Mover} mover The mover
 * @returns {Boolean} True if the tutorial has finished
 */
TutorialCards.prototype.update = function(constellation, mover) {
    switch (this.phase) {
        case this.PHASE_START:
            if (this.mutations < this.MUTATIONS_REQUIRED)
                this.phase = this.PHASE_WAITING;
            else if (this.mutations === this.MUTATIONS_REQUIRED)
                this.start();
            else
                return true;

            break;
        case this.PHASE_CREATE_CARD:

            break;
    }

    return false;
};