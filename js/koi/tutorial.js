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
    this.bred = false;
};

Tutorial.prototype.PHASE_WAITING = -1;
Tutorial.prototype.PHASE_MOVE_FISH = 0;
Tutorial.prototype.PHASE_DROP_FISH = 1;
Tutorial.prototype.PHASE_TO_POND_1 = 2;
Tutorial.prototype.PHASE_TO_POND_2 = 3;
Tutorial.prototype.PHASE_BREED_WAIT = 4;
Tutorial.prototype.PHASE_BREED_TOO_MANY = 5;
Tutorial.prototype.LANG_MOVE_FISH = "TUTORIAL_MOVE_FISH";
Tutorial.prototype.LANG_TO_POND_1 = "TUTORIAL_MOVE_POND_1";
Tutorial.prototype.LANG_TO_POND_2 = "TUTORIAL_MOVE_POND_2";
Tutorial.prototype.LANG_BREED_WAIT = "TUTORIAL_BREED_WAIT";
Tutorial.prototype.LANG_BREED_TOO_MANY = "TUTORIAL_BREED_TOO_MANY";
Tutorial.prototype.FISH_SELECT_THRESHOLD = 1.2;
Tutorial.prototype.FISH_LOSE_THRESHOLD = 1;
Tutorial.prototype.START_DELAY = 10;

/**
 * A function that is called after breeding took place
 * @param {Constellation} constellation The constellation
 * @param {Pond} pond The pond where the breeding took place
 */
Tutorial.prototype.onBreed = function(constellation, pond) {
    if (pond === constellation.small)
        this.bred = true;
};

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
 * @param {Mover} mover The mover
 * @returns {Boolean} True if the tutorial has finished
 */
Tutorial.prototype.update = function(constellation, mover) {
    switch (this.phase) {
        case this.PHASE_WAITING:
            if (++this.waited === this.START_DELAY) {
                this.overlay.setText(language.get(this.LANG_MOVE_FISH));

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
                if (mover.move) {
                    this.overlay.deletePointer();

                    this.pointer = null;
                    this.targetedFish = null;

                    ++this.phase;
                }
                else if (this.targetedFish.position.x < this.FISH_LOSE_THRESHOLD ||
                    this.targetedFish.position.x > constellation.width - this.FISH_LOSE_THRESHOLD ||
                    this.targetedFish.position.y > constellation.height - this.FISH_LOSE_THRESHOLD) {
                    this.overlay.deletePointer();

                    this.pointer = null;
                    this.targetedFish = null;
                }
            }

            break;
        case this.PHASE_DROP_FISH:
            if (!mover.move) {
                if (constellation.small.fishes.length === 0) {
                    this.overlay.setText(language.get(this.LANG_TO_POND_1));
                    this.phase = this.PHASE_TO_POND_1;
                }
                else {
                    this.overlay.setText(language.get(this.LANG_TO_POND_2));
                    this.phase = this.PHASE_TO_POND_2;
                }
            }

            break;
        case this.PHASE_TO_POND_1:
            if (constellation.small.fishes.length === 1) {
                this.overlay.setText(language.get(this.LANG_TO_POND_2));
                this.phase = this.PHASE_TO_POND_2;
            }

            break;
        case this.PHASE_TO_POND_2:
            if (constellation.small.fishes.length === 2) {
                this.overlay.setText(language.get(this.LANG_BREED_WAIT));
                this.phase = this.PHASE_BREED_WAIT;
            }
            else if (constellation.small.fishes.length === 0) {
                this.overlay.setText(language.get(this.LANG_TO_POND_1));
                this.phase = this.PHASE_TO_POND_1;
            }

            break;
        case this.PHASE_BREED_WAIT:
            if (this.bred) {
                this.overlay.removeText();

                return true;
            }

            if (constellation.small.fishes.length > 2) {
                this.overlay.setText(language.get(this.LANG_BREED_TOO_MANY));
                this.phase = this.PHASE_BREED_TOO_MANY;
            }
            else if (constellation.small.fishes.length < 2) {
                this.overlay.setText(language.get(this.LANG_TO_POND_2));
                this.phase = this.PHASE_TO_POND_2;
            }

            break;
        case this.PHASE_BREED_TOO_MANY:
            if (constellation.small.fishes.length === 2) {
                this.overlay.setText(language.get(this.LANG_BREED_WAIT));
                this.phase = this.PHASE_BREED_WAIT;
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