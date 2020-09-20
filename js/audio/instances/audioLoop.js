/**
 * Looping audio
 * @param {AudioEngine} engine The audio engine
 * @param {String} source The source file
 * @constructor
 */
const AudioLoop = function(engine, source) {
    this.engine = engine;
    this.element = new Audio(source);
    this.element.loop = true;
    this.track = null;
};

/**
 * An audio loop track
 * @param {AudioEngine} engine The audio engine
 * @param {HTMLMediaElement} audio An audio element
 * @constructor
 */
AudioLoop.Track = function(engine, audio) {
    const source = engine.createSourceNode(audio);

    source.connect(engine.getDestinationNode());
};

/**
 * Ensure the audio is playing
 */
AudioLoop.prototype.loop = function() {
    if (!this.engine.initialized)
        return;

    if (!this.track)
        this.track = new AudioLoop.Track(this.engine, this.element);

    if (this.element.paused)
        this.element.play();
};

/**
 * Stop the loop
 */
AudioLoop.prototype.stop = function() {
    this.element.pause();
};