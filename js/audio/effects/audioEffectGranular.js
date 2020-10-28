/**
 * Granular audio
 * @param {Number} interval The interval between effects in seconds
 * @param {Number} decay The decay time in seconds
 * @param {AudioEffect} effect The effect
 * @constructor
 */
const AudioEffectGranular = function(interval, decay, effect) {
    this.interval = interval;
    this.decay = decay;
    this.effect = effect;
    this.intensity = 0;
    this.pan = 0;
    this.volume = 0;
    this.time = 0;
};

/**
 * Update the effect
 * @param {Number} delta The amount of time passed since the last update
 */
AudioEffectGranular.prototype.update = function(delta) {
    if (this.intensity !== 0) {
        if ((this.time += delta) > this.interval) {
            this.time -= this.interval;

            this.effect.play(this.pan, this.volume * this.intensity);
        }

        if ((this.intensity -= this.decay * delta) < 0)
            this.intensity = 0;
    }
};

/**
 * Set the granular effect parameters
 * @param {Number} pan The pan in the range [-1, 1]
 * @param {Number} volume The volume in the range [0, 1]
 * @param {Number} [playbackRate] The playback rate, which also changes pitch
 */
AudioEffectGranular.prototype.set = function(pan, volume, playbackRate = 1) {
    this.pan = pan;
    this.volume = volume;
    this.intensity = 1;
    this.effect.setPlaybackRate(playbackRate);
};