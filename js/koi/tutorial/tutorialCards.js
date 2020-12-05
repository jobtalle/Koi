/**
 * The cards tutorial
 * @param {Overlay} overlay The overlay object to show hints on
 * @constructor
 */
const TutorialCards = function(overlay) {
    Tutorial.call(this, overlay);
    console.log("Start cards tutorial");
    this.mutations = Number.parseInt(localStorage.getItem("tutorial"));
};

TutorialCards.prototype = Object.create(Tutorial.prototype);