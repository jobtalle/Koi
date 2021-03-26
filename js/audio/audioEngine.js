/**
 * The audio engine
 * @param {Random} random A randomizer
 * @constructor
 */
const AudioEngine = function(random) {
    this.initialized = false;
    this.random = random;
    this.granular = true;
};

AudioEngine.prototype.PAN_AMPLITUDE = .7;
AudioEngine.prototype.PAN_DEAD_ZONE = .3;

/**
 * Interact with the audio engine to enable it
 */
AudioEngine.prototype.interact = function() {
    this.initialized = true;
};

/**
 * Set the master volume
 * @param {Number} volume The volume in the range [0, 1]
 */
AudioEngine.prototype.setMasterVolume = function(volume) {
    Howler.volume(volume);
};

/**
 * Transform the pan position to audio pan
 * @param {Number} pan The pan position in the range [-1, 1]
 * @returns {Number} The pan in the range [-1, 1]
 */
AudioEngine.prototype.transformPan = function(pan) {
    return Math.sign(pan) * Math.max(
        0,
        Math.abs(pan) - this.PAN_DEAD_ZONE) * (this.PAN_AMPLITUDE / (1 - this.PAN_DEAD_ZONE));
};