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
    this.howls = new Array(this.variations);
    this.playbackRate = 1;

    if (this.singleSource) {
        this.howls[0] = this.createElement(sources);
        this.howls[1] = this.createElement(sources);
    }
    else for (let source = 0; source < this.variations; ++source)
        this.howls[source] = this.createElement(sources[source]);
};

/**
 * Create an audio element
 * @param {String} source The audio source
 * @param {Function} [onLoad] The function to play on load
 * @returns {HTMLAudioElement} An audio element
 */
AudioEffect.prototype.createElement = function(source, onLoad = null) {
    const howl = new Howl({
        src: [source]
    });

    howl.once("load", onLoad);

    return howl;
};

/**
 * Play this audio effect
 * @param {Number} [pan] The pan in the range [-1, 1]
 * @param {Number} [volume] The volume in the range [0, 1]
 * @returns {Number} The duration of the effect
 */
AudioEffect.prototype.play = function(pan = 0, volume = 1) {
    let index = Math.floor(this.engine.random.getFloat() * this.variations);

    for (let offset = 0; offset < this.variations; ++offset) {
        if (!this.howls[index].playing()) {
            this.howls[index].stereo(pan);
            this.howls[index].volume(volume);

            if (this.playbackRate !== 1)
                this.howls[index].rate(this.playbackRate);

            this.howls[index].play();

            return this.howls[index].duration();
        }
        else if (++index === this.variations)
            index = 0;
    }

    if (this.singleSource) {
        this.howls.push(this.createElement(this.howls[this.howls.length - 1].src));

        ++this.variations;

        return this.play(pan, volume);
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