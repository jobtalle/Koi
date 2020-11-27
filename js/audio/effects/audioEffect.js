/**
 * A single audio effect
 * @param {AudioEngine} engine The audio engine
 * @param {String[]} sources An array of paths to all possible variations of this effect
 * @constructor
 */
const AudioEffect = function(engine, sources) {
    this.engine = engine;
    this.variations = sources.length;
    this.elements = new Array(this.variations);
    this.tracks = new Array(this.variations).fill(null);
    this.playbackRate = 1;

    for (let source = 0; source < this.variations; ++source) {
        const requirement = loader.createRequirement(this.REQUIREMENT_WEIGHT);

        this.elements[source] = new Audio(sources[source]);

        // TODO: Adapt to extension
        this.elements[source].type = "audio/ogg";
        this.elements[source].codecs = "vorbis";
        this.elements[source].onloadedmetadata = requirement.satisfy.bind(requirement);
    }
};

/**
 * An effect track
 * @param {AudioEngine} engine The audio engine
 * @param {HTMLMediaElement} audio An audio element
 * @constructor
 */
AudioEffect.Track = function(engine, audio) {
    const source = engine.createSourceNode(audio);

    this.nodePan = engine.createPanNode();
    this.nodeGain = engine.createGainNode();

    source.connect(this.nodePan).connect(this.nodeGain).connect(engine.getDestinationNode());
};

/**
 * Set the pan
 * @param {Number} pan The pan in the range [-1, 1];
 */
AudioEffect.Track.prototype.setPan = function(pan) {
    this.nodePan.pan.value = pan;
};

/**
 * Set the volume
 * @param {Number} volume The volume in the range [0, 1]
 */
AudioEffect.Track.prototype.setVolume = function(volume) {
    this.nodeGain.gain.value = volume;
};

AudioEffect.prototype.REQUIREMENT_WEIGHT = 1;

/**
 * Play this audio effect
 * @param {Number} [pan] The pan in the range [-1, 1]
 * @param {Number} [volume] The volume in the range [0, 1]
 * @returns {Number} The duration of the effect
 */
AudioEffect.prototype.play = function(pan = 0, volume = 1) {
    if (!this.engine.initialized)
        return 0;

    let index = Math.floor(this.engine.random.getFloat() * this.variations);

    for (let offset = 0; offset < this.variations; ++offset) {
        if (this.elements[index].paused) {
            if (this.tracks[index] === null)
                this.tracks[index] = new AudioEffect.Track(this.engine, this.elements[index]);

            this.tracks[index].setPan(pan);
            this.tracks[index].setVolume(volume);

            if (this.playbackRate !== 1)
                this.elements[index].playbackRate = this.playbackRate;

            this.elements[index].play();

            return this.elements[index].duration;
        }
        else if (++index === this.variations)
            index = 0;
    }

    return 0;
};

/**
 * Set the playback rate of this effect
 * @param {Number} playbackRate The playback rate
 */
AudioEffect.prototype.setPlaybackRate = function(playbackRate) {
    this.playbackRate = playbackRate;
};