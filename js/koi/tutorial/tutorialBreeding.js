/**
 * The breeding tutorial
 * @param {Storage} storage A storage system
 * @param {Overlay} overlay The overlay object to show hints on
 * @constructor
 */
const TutorialBreeding = function(storage, overlay) {
    Tutorial.call(this, storage, overlay, false);

    this.pointer = null;
    this.targetedFish = null;
    this.bred = false;
    this.mutated = false;
    this.skip = false;

    overlay.setText(language.get(this.LANG_MOVE_FISH));
    overlay.createSkip(() => {
        this.skip = true;
    });
};

TutorialBreeding.prototype = Object.create(Tutorial.prototype);
TutorialBreeding.prototype.PHASE_MOVE_FISH = 0;
TutorialBreeding.prototype.PHASE_DROP_FISH = 1;
TutorialBreeding.prototype.PHASE_TO_POND_1 = 2;
TutorialBreeding.prototype.PHASE_TO_POND_2 = 3;
TutorialBreeding.prototype.PHASE_BREED_WAIT = 4;
TutorialBreeding.prototype.PHASE_BREED_TOO_MANY = 5;
TutorialBreeding.prototype.PHASE_CROSSBREED = 6;
TutorialBreeding.prototype.LANG_MOVE_FISH = "TUTORIAL_MOVE_FISH";
TutorialBreeding.prototype.LANG_TO_POND_1 = "TUTORIAL_MOVE_POND_1";
TutorialBreeding.prototype.LANG_TO_POND_2 = "TUTORIAL_MOVE_POND_2";
TutorialBreeding.prototype.LANG_BREED_WAIT = "TUTORIAL_BREED_WAIT";
TutorialBreeding.prototype.LANG_BREED_TOO_MANY = "TUTORIAL_BREED_TOO_MANY";
TutorialBreeding.prototype.LANG_CROSSBREED = "TUTORIAL_CROSSBREED";
TutorialBreeding.prototype.FISH_SELECT_THRESHOLD = 1.2;
TutorialBreeding.prototype.FISH_LOSE_THRESHOLD = .4;

/**
 * A function that is called after breeding took place
 * @param {Constellation} constellation The constellation
 * @param {Pond} pond The pond where the breeding took place
 * @param {Boolean} mutated True if a mutation occurred
 */
TutorialBreeding.prototype.onBreed = function(constellation, pond, mutated) {
    if (pond === constellation.small)
        this.bred = true;

    if (mutated)
        this.mutated = true;
};

/**
 * Get the whitelist of fish that may be interacted with
 * @returns {Fish[]} The whitelist of fish, or null if there is no whitelist
 */
TutorialBreeding.prototype.getInteractionWhitelist = function() {
    if (this.phase === this.PHASE_MOVE_FISH) {
        if (this.targetedFish)
            return [this.targetedFish];

        return [];
    }

    return null;
};

/**
 * Target a fish currently in the river
 * @param {Constellation} constellation The constellation
 * @returns {Fish} A fish, or null if no suitable fish was found
 */
TutorialBreeding.prototype.targetRiverFish = function(constellation) {
    let nearestSquaredDist = .25 *
        (constellation.width * constellation.width + constellation.height * constellation.height);
    let nearest = null;

    for (const fish of constellation.river.fish) {
        const position = fish.body.getOffspringPosition();

        if (position.x < this.FISH_SELECT_THRESHOLD ||
            position.y < this.FISH_SELECT_THRESHOLD ||
            position.x > constellation.width - this.FISH_SELECT_THRESHOLD ||
            position.y > constellation.height - this.FISH_SELECT_THRESHOLD)
            continue;

        const dx = constellation.width * .5 - position.x;
        const dy = constellation.height * .5 - position.y;
        const sd = dx * dx + dy * dy;

        if (sd < nearestSquaredDist) {
            nearestSquaredDist = sd;
            nearest = fish;
        }
    }

    return nearest;
};

/**
 * Point towards the small pond
 * @param {Koi} koi The koi object
 */
TutorialBreeding.prototype.pointToSmallPond = function(koi) {
    this.overlay.createArrowAt(
        "down",
        koi.constellation.getPixelX(koi.constellation.small.constraint.position.x, koi.scale),
        koi.constellation.getPixelY(koi.constellation.small.constraint.position.y, koi.scale));
};

/**
 * Update the tutorial state
 * @param {Koi} koi The koi object
 * @returns {Boolean} True if the tutorial has finished
 */
TutorialBreeding.prototype.update = function(koi) {
    if (this.skip) {
        this.overlay.clear();

        return true;
    }

    switch (this.phase) {
        case this.PHASE_MOVE_FISH:
            if (this.targetedFish === null) {
                if ((this.targetedFish = this.targetRiverFish(koi.constellation)))
                    this.pointer = this.overlay.createPointer();
            }
            else {
                if (koi.mover.move ) {
                    this.overlay.deletePointer();

                    this.pointer = null;
                    this.targetedFish = null;

                    this.advance();
                }
                else {
                    const position = this.targetedFish.body.getOffspringPosition();

                    if (position.x < this.FISH_LOSE_THRESHOLD ||
                        position.y < this.FISH_LOSE_THRESHOLD ||
                        position.x > koi.constellation.width - this.FISH_LOSE_THRESHOLD ||
                        position.y > koi.constellation.height - this.FISH_LOSE_THRESHOLD) {
                        this.overlay.deletePointer();

                        this.pointer = null;
                        this.targetedFish = null;
                    }
                }
            }

            break;
        case this.PHASE_DROP_FISH:
            if (!koi.mover.move) {
                if (koi.constellation.small.fish.length === 0 ) {
                    this.overlay.setText(language.get(this.LANG_TO_POND_1));

                    this.pointToSmallPond(koi);
                    this.advance();
                }
                else {
                    this.overlay.setText(language.get(this.LANG_TO_POND_2));
                    this.phase = this.PHASE_TO_POND_2;
                }
            }

            break;
        case this.PHASE_TO_POND_1:
            if (koi.constellation.small.fish.length === 1 ) {
                this.overlay.setText(language.get(this.LANG_TO_POND_2));
                this.overlay.deleteArrow();

                this.advance();
            }

            break;
        case this.PHASE_TO_POND_2:
            if (koi.constellation.small.fish.length === 2) {
                this.overlay.setText(language.get(this.LANG_BREED_WAIT));
                this.phase = this.PHASE_BREED_WAIT;
            }
            else if (koi.constellation.small.fish.length === 0) {
                this.pointToSmallPond(koi);

                this.overlay.setText(language.get(this.LANG_TO_POND_1));
                this.phase = this.PHASE_TO_POND_1;
            }

            break;
        case this.PHASE_BREED_WAIT:
            if (this.bred) {
                this.overlay.setText(language.get(this.LANG_CROSSBREED));

                this.allowMutation = true;
                this.phase = this.PHASE_CROSSBREED;

                break;
            }

            if (koi.constellation.small.fish.length > 2) {
                this.overlay.setText(language.get(this.LANG_BREED_TOO_MANY));
                this.phase = this.PHASE_BREED_TOO_MANY;
            }
            else if (koi.constellation.small.fish.length < 2) {
                this.overlay.setText(language.get(this.LANG_TO_POND_2));
                this.phase = this.PHASE_TO_POND_2;
            }

            break;
        case this.PHASE_BREED_TOO_MANY:
            if (koi.constellation.small.fish.length === 2) {
                this.overlay.setText(language.get(this.LANG_BREED_WAIT));
                this.phase = this.PHASE_BREED_WAIT;
            }

            break;
        case this.PHASE_CROSSBREED:
            if (this.mutated) {
                this.overlay.removeText();

                return true;
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
TutorialBreeding.prototype.render = function(constellation, scale, time) {
    switch (this.phase) {
        case this.PHASE_MOVE_FISH:
            if (this.pointer) {
                const positionPrevious = this.targetedFish.body.getOffspringPositionPrevious();
                const position = this.targetedFish.body.getOffspringPosition();
                this.pointer.x = constellation.getPixelX(
                    positionPrevious.x + (position.x - positionPrevious.x) * time, scale);
                this.pointer.y = constellation.getPixelY(
                    positionPrevious.y + (position.y - positionPrevious.y) * time, scale);
            }

            break;
    }
};