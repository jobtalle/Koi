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

    for (let source = 0; source < this.variations; ++source)
        this.elements[source] = new Audio(sources[source]);
};

/**
 * An effect track
 * @param {AudioEngine} engine The audio engine
 * @param {HTMLMediaElement} audio An audio element
 * @constructor
 */
AudioEffect.Track = function(engine, audio) {
    const source = engine.createSourceNode(audio);

    if (!source)
        return null;

    source.connect(engine.getDestinationNode());
};

/**
 * Play this audio effect
 * @returns {Number} The duration of the effect
 */
AudioEffect.prototype.play = function() {
    if (!this.engine.initialized())
        return 0;

    let index = Math.floor(this.engine.random.getFloat() * this.variations);

    for (let offset = 0; offset < this.variations; ++offset) {
        if (this.elements[index].paused) {
            if (this.tracks[index] === null)
                this.tracks[index] = new AudioEffect.Track(this.engine, this.elements[index]);

            this.elements[index].play();

            return this.elements[index].duration;
        }
        else if (++index === this.variations)
            index = 0;
    }

    return 0;
}