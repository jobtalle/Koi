/**
 * Granular audio
 * @param {Number} interval The interval between effects in seconds
 * @param {Number} decay The decay time in seconds
 * @param {Sampler} rateSampler The sampler for the playback rate depending on volume
 * @param {AudioEffect} effect The effect
 * @constructor
 */
const AudioEffectGranular = function(interval, decay, rateSampler, effect) {
    this.interval = interval;
    this.decay = decay;
    this.rateSampler = rateSampler;
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
    if (!this.effect.engine.granular)
        return;

    if (this.volume !== 0) {
        if ((this.time += delta) > this.interval) {
            this.time -= this.interval;

            this.effect.setPlaybackRate(this.rateSampler.sample(this.volume));
            this.effect.play(this.pan, this.volume);
        }

        if ((this.volume -= this.decay * delta) < 0)
            this.volume = 0;
    }
};

/**
 * Set the granular effect parameters
 * @param {Number} pan The pan in the range [-1, 1]
 * @param {Number} volume The volume in the range [0, 1]
 */
AudioEffectGranular.prototype.set = function(pan, volume) {
    if (!this.effect.engine.granular)
        return;

    this.pan = pan;
    this.volume = Math.max(this.volume, volume);
};