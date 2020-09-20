/**
 * A single audio effect
 * @param {AudioEngine} engine The audio engine
 * @param {String[]} sources An array of paths to all possible variations of this effect
 * @constructor
 */
const AudioEffect = function(engine, sources) {
    this.engine = engine;
    this.variations = [];

    for (const source of sources)
        this.variations.push(new Audio(source));
};

/**
 * Play this audio effect
 */
AudioEffect.prototype.play = function() {
    this.variations[Math.floor(this.engine.random.getFloat() * this.variations.length)].play();
}