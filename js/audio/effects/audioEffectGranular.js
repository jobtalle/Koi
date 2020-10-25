/**
 * Granular audio
 * @param {AudioEffect} effect The effect
 * @constructor
 */
const AudioEffectGranular = function(effect) {
    this.effect = effect;
    this.countdown = 0;
};

/**
 * Trigger granular audio effects
 * @param {Number} amount The effect amount, every unit triggers 1 effect
 * @param {Number} [pan] The pan in the range [-1, 1]
 * @param {Number} [volume] The volume in the range [0, 1]
 */
AudioEffectGranular.prototype.generate = function(amount, pan = 0, volume = 1) {
    this.countdown -= amount;

    if (this.countdown < 0) while (this.countdown++ < 0)
        this.effect.play(pan, volume);
};