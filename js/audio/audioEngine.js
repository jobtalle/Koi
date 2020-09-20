/**
 * The audio engine
 * @param {Random} random A randomizer
 * @constructor
 */
const AudioEngine = function(random) {
    this.context = null;
    this.random = random;
};

AudioEngine.prototype.interact = function() {
    if (!this.context)
        this.context = new AudioContext();
};