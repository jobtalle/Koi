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