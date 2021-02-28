/**
 * A single audio effect
 * @param {AudioEngine} engine The audio engine
 * @param {String[]|String} sources An array of paths to all possible variations of this effect, or a single path
 * @constructor
 */
const AudioEffect = function(engine, sources) {
    this.singleSource = typeof sources === "string";
    this.engine = engine;
    this.variations = this.singleSource ? 2 : sources.length;
    this.elements = new Array(this.variations);
    this.tracks = new Array(this.variations).fill(null);
    this.playbackRate = 1;

    if (this.singleSource) {
        const requirement1 = loader.createRequirement(this.REQUIREMENT_WEIGHT);
        const requirement2 = loader.createRequirement(this.REQUIREMENT_WEIGHT);

        this.elements[0] = this.createElement(sources, requirement1.satisfy.bind(requirement1));
        this.elements[1] = this.createElement(sources, requirement2.satisfy.bind(requirement2));
    }
    else for (let source = 0; source < this.variations; ++source) {
        const requirement = loader.createRequirement(this.REQUIREMENT_WEIGHT);

        this.elements[source] = this.createElement(sources[source], requirement.satisfy.bind(requirement));
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

    this.element = audio;
    this.nodePan = engine.createPanNode();
    this.nodeGain = engine.createGainNode();

    source.connect(this.nodePan).connect(this.nodeGain).connect(engine.getDestinationNode());

    engine.register(this);
};

/**
 * Set the pan
 * @param {Number} pan The pan in the range [-1, 1];
 */
AudioEffect.Track.prototype.setPan = function(pan) {
    this.nodePan.pan.value = Math.min(1, Math.max(-1, pan));
};

/**
 * Set the volume
 * @param {Number} volume The volume in the range [0, 1]
 */
AudioEffect.Track.prototype.setVolume = function(volume) {
    this.nodeGain.gain.value = Math.min(1, Math.max(0, volume));
};

/**
 * Change the volume
 * @param {Number} previous The previous volume multiplier in the range [0, 1]
 * @param {Number} volume The new volume multiplier in the range [0, 1]
 */
AudioEffect.Track.prototype.changeVolume = function(previous, volume) {
    const original = this.nodeGain.gain.value / previous;

    this.setVolume(original * volume);
};

AudioEffect.prototype.REQUIREMENT_WEIGHT = 1;

/**
 * Create an audio element
 * @param {String} source The audio source
 * @param {Function} [onLoad] The function to play on load
 * @returns {HTMLAudioElement} An audio element
 */
AudioEffect.prototype.createElement = function(source, onLoad = null) {
    const element = new Audio();

    element.type = "audio/ogg";
    element.codecs = "vorbis";
    element.src = source;

    if (onLoad)
        element.onloadeddata = onLoad;

    return element;
};

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
            this.tracks[index].setVolume(volume * this.engine.volume);

            if (this.playbackRate !== 1)
                this.elements[index].playbackRate = this.playbackRate;

            this.elements[index].play();

            return this.elements[index].duration;
        }
        else if (++index === this.variations)
            index = 0;
    }

    if (this.singleSource) {
        this.elements.push(this.createElement(this.elements[this.elements.length - 1].src));
        this.tracks.push(new AudioEffect.Track(this.engine, this.elements[this.elements.length - 1]));

        ++this.variations;

        return this.play(pan, volume * this.engine.volume);
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