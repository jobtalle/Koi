/**
 * An audio effect that plays overlapping effects with a fixed start and end effect
 * @param {Number} overlap The overlap in seconds
 * @param {AudioEffect} start The audio effect to start with
 * @param {AudioEffect} body The audio effect to loop
 * @param {AudioEffect} end The audio effect to end with
 * @constructor
 */
const AudioEffectPeriodicBounded = function(overlap, start, body, end) {
    this.overlap = overlap;
    this.start = start;
    this.body = body;
    this.end = end;
    this.countdown = 0;
    this.stopped = false;
    this.ended = true;
};

/**
 * Start playing the effect
 */
AudioEffectPeriodicBounded.prototype.play = function() {
    this.stopped = false;
    this.ended = false;
    this.countdown = this.start.play() - this.overlap;
};

/**
 * Start playing the effect without the intro segment
 */
AudioEffectPeriodicBounded.prototype.playBody = function() {
    this.stopped = false;
    this.ended = false;
    this.countdown = this.body.play() - this.overlap;
};

/**
 * Stop playing the effect, and queue the closing sequence as soon as possible
 */
AudioEffectPeriodicBounded.prototype.stop = function() {
    this.stopped = true;
};

/**
 * Update the effect, also required after queueing the end of the effect
 * @param {Number} delta The amount of time passed since the last update
 */
AudioEffectPeriodicBounded.prototype.update = function(delta) {
    if (this.ended)
        return;

    if ((this.countdown -= delta) < 0) {
        if (this.stopped) {
            this.end.play();
            this.ended = true;
        }
        else if ((this.countdown = this.body.play() - this.overlap) < 0)
            this.countdown = 0;
    }
};