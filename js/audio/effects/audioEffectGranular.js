/**
 * Granular audio
 * @param {Number} interval The interval between effects in seconds
 * @param {AudioEffect} effect The effect
 * @constructor
 */
const AudioEffectGranular = function(interval, effect) {
    this.interval = interval;
    this.effect = effect;
    this.pan = 0;
    this.volume = 0;
    this.time = 0;
};

/**
 * Update the effect
 * @param {Number} delta The amount of time passed since the last update
 */
AudioEffectGranular.prototype.update = function(delta) {
    if ((this.time += delta) > this.interval) {
        this.time -= this.interval;

        if (this.volume !== 0)
            this.effect.play(this.pan, this.volume);
    }
};

/**
 * Set the granular effect parameters
 * @param {Number} [pan] The pan in the range [-1, 1]
 * @param {Number} [volume] The volume in the range [0, 1]
 */
AudioEffectGranular.prototype.set = function(pan, volume) {
    this.pan = pan;
    this.volume = volume;
};