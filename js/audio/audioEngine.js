/**
 * The audio engine
 * @param {Random} random A randomizer
 * @constructor
 */
const AudioEngine = function(random) {
    this.context = null;
    this.initialized = false;
    this.random = random;
    this.volume = 1;
    this.granular = true;
    this.tracks = [];
};

AudioEngine.prototype.PAN_AMPLITUDE = .7;
AudioEngine.prototype.PAN_DEAD_ZONE = .3;

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
 * Set the master volume
 * @param {Number} volume The volume in the range [0, 1]
 */
AudioEngine.prototype.setMasterVolume = function(volume) {
    const previous = this.volume;

    this.volume = volume;

    for (const track of this.tracks) if (!track.element.paused)
        track.changeVolume(previous, volume);
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

/**
 * Register an audio track
 * @param {AudioEffect.Track} track The audio track
 */
AudioEngine.prototype.register = function(track) {
    this.tracks.push(track);
};