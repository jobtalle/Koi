/**
 * The audio engine
 * @param {Random} random A randomizer
 * @constructor
 */
const AudioEngine = function(random) {
    this.context = null;
    this.initialized = false;
    this.random = random;
};

/**
 * Interact with the audio engine to enable it
 */
AudioEngine.prototype.interact = function() {
    if (!this.context) {
        this.context = new AudioContext();
        this.initialized = true;
    }
};

/**
 * Create a source node from an audio element
 * @param {HTMLMediaElement} audio An audio element
 * @returns {MediaElementAudioSourceNode|null} A source node, or null if the engine is not yet active
 */
AudioEngine.prototype.createSourceNode = function(audio) {
    return this.context.createMediaElementSource(audio);
};

/**
 * Create a gain node
 * @returns {GainNode} A gain node
 */
AudioEngine.prototype.createGainNode = function() {
    return this.context.createGain();
};

/**
 * Create a stereo panner node
 * @returns {StereoPannerNode} A stereo panner node
 */
AudioEngine.prototype.createPanNode = function() {
    return this.context.createStereoPanner();
};

/**
 * Get the audio destination node
 * @returns {AudioDestinationNode|null} The destination node, or null if the engine is not yet active
 */
AudioEngine.prototype.getDestinationNode = function() {
    return this.context.destination;
};