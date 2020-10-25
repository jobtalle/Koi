/**
 * An audio effect that plays overlapping effects
 * @param {Number} overlap The overlap in seconds
 * @param {AudioEffect} effect The effect to play
 * @constructor
 */
const AudioEffectPeriodic = function(overlap, effect) {
    this.overlap = overlap;
    this.effect = effect;
    this.countdown = 0;
};

/**
 * Update the effect
 * @param {Number} delta The amount of time passed since the last update
 */
AudioEffectPeriodic.prototype.update = function(delta) {
    if ((this.countdown -= delta) < 0)
        if ((this.countdown += this.effect.play() - this.overlap) < 0)
            this.countdown = 0;
};