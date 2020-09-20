/**
 * The audio engine
 * @param {Random} random A randomizer
 * @constructor
 */
const AudioEngine = function(random) {
    this.context = null;
    this.random = random;
};

/**
 * Interact with the audio engine to enable it
 */
AudioEngine.prototype.interact = function() {
    if (!this.context)
        this.context = new AudioContext();
};

/**
 * Create a source node from an audio element
 * @param {HTMLMediaElement} audio An audio element
 * @returns {MediaElementAudioSourceNode|null} A source node, or null if the engine is not yet active
 */
AudioEngine.prototype.createSourceNode = function(audio) {
    if (this.context)
        return this.context.createMediaElementSource(audio);

    return null;
};

/**
 * Create a gain node
 * @returns {GainNode} A gain node
 */
AudioEngine.prototype.createGainNode = function() {
    if (this.context)
        return this.context.createGain();

    return null;
};

/**
 * Create a stereo panner node
 * @returns {StereoPannerNode} A stereo panner node
 */
AudioEngine.prototype.createPanNode = function() {
    if (this.context)
        return new StereoPannerNode(this.context);

    return null;
};

/**
 * Get the audio destination node
 * @returns {AudioDestinationNode|null} The destination node, or null if the engine is not yet active
 */
AudioEngine.prototype.getDestinationNode = function() {
    if (this.context)
        return this.context.destination;

    return null;
};

/**
 * Make a new audio track
 * @param {HTMLMediaElement} audio An audio element
 */
AudioEngine.prototype.makeTrack = function(audio) {
    if (this.context) {
        const track = this.context.createMediaElementSource(audio);
        const gain = this.context.createGain();

        gain.gain.value = 3.5;

        track.connect(gain).connect(this.context.destination);

        return track;
    }

    return null;
};