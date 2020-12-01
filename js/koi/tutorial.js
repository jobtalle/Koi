/**
 * The tutorial
 * @param {Overlay} overlay The overlay object to show hints on
 * @constructor
 */
const Tutorial = function(overlay) {
    this.overlay = overlay;
    this.phase = this.PHASE_WAITING;
    this.pointer = null;
    this.targetedFish = null;
    this.waited = 0;
};

Tutorial.prototype.PHASE_WAITING = -1;
Tutorial.prototype.PHASE_MOVE_FISH = 0;
Tutorial.prototype.PHASE_SELECT_FISH_1 = 1;
Tutorial.prototype.PHASE_SELECT_FISH_2 = 2;
Tutorial.prototype.LANG_MOVE_FISH = "TUTORIAL_MOVE_FISH";
Tutorial.prototype.FISH_SELECT_THRESHOLD = 1.8;
Tutorial.prototype.FISH_LOSE_THRESHOLD = 1;
Tutorial.prototype.START_DELAY = 10;

/**
 * Target a fish currently in the river
 * @param {Constellation} constellation The constellation
 * @returns {Fish} A fish, or null if no suitable fish was found
 */
Tutorial.prototype.targetRiverFish = function(constellation) {
    let nearestSquaredDist = .25 *
        (constellation.width * constellation.width + constellation.height * constellation.height);
    let nearest = null;

    for (const fish of constellation.river.fishes) {
        if (fish.position.x < this.FISH_SELECT_THRESHOLD ||
            fish.position.y < this.FISH_SELECT_THRESHOLD ||
            fish.position.x > constellation.width - this.FISH_SELECT_THRESHOLD ||
            fish.position.y > constellation.height - this.FISH_SELECT_THRESHOLD)
            continue;

        const dx = constellation.width * .5 - fish.position.x;
        const dy = constellation.height * .5 - fish.position.y;
        const sd = dx * dx + dy * dy;

        if (sd < nearestSquaredDist) {
            nearestSquaredDist = sd;
            nearest = fish;
        }
    }

    return nearest;
};

/**
 * Update the tutorial state
 * @param {Constellation} constellation The constellation
 * @returns {Boolean} True if the tutorial has finished
 */
Tutorial.prototype.update = function(constellation) {
    switch (this.phase) {
        case this.PHASE_WAITING:
            if (++this.waited === this.START_DELAY) {
                this.overlay.setMessage(language.get(this.LANG_MOVE_FISH));

                ++this.phase;
            }

            break;
        case this.PHASE_MOVE_FISH:
            if (this.targetedFish === null) {
                if ((this.targetedFish = this.targetRiverFish(constellation))) {
                    this.pointer = this.overlay.createPointer();

                    console.log("Found");
                }
            }
            else {
                if (this.targetedFish.position.x < this.FISH_LOSE_THRESHOLD ||
                    this.targetedFish.position.y < this.FISH_LOSE_THRESHOLD ||
                    this.targetedFish.position.x > constellation.width - this.FISH_LOSE_THRESHOLD ||
                    this.targetedFish.position.y > constellation.height - this.FISH_LOSE_THRESHOLD) {
                    this.overlay.deletePointer();
                    this.pointer = null;
                    this.targetedFish = null;
                }
            }

            break;
    }

    return false;
};

/**
 * Render the tutorial
 * @param {Constellation} constellation The constellation
 * @param {Number} scale The scale
 * @param {Number} time The amount of time since the last update
 */
Tutorial.prototype.render = function(constellation, scale, time) {
    switch (this.phase) {
        case this.PHASE_MOVE_FISH:
            if (this.pointer) {
                this.pointer.x = constellation.getPixelX(
                    this.targetedFish.positionPrevious.x +
                    (this.targetedFish.position.x - this.targetedFish.positionPrevious.x) * time,
                    scale);
                this.pointer.y = constellation.getPixelY(
                    this.targetedFish.positionPrevious.y +
                    (this.targetedFish.position.y - this.targetedFish.positionPrevious.y) * time,
                    scale);
            }

            break;
    }
};