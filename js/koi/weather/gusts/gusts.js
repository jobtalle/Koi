/**
 * The frequency gusts system
 * @param {Constellation} constellation The constellation
 * @constructor
 */
const Gusts = function(constellation) {
    this.frequency = 0;
    this.intensity = 0;
    this.windTime = 1;
    this.constellation = constellation;
    this.gusts = [];
};

Gusts.prototype.SAMPLER_TIME = new Sampler(10, 15);
Gusts.prototype.SAMPLER_HEIGHT = new Sampler(.9, 1.6);
Gusts.prototype.SAMPLER_SLANT = new Sampler(-.3, .3);
Gusts.prototype.SAMPLER_DISTANCE = new Sampler(.6, 1.4);
Gusts.prototype.SAMPLER_SPEED = new Sampler(.15, .3);

/**
 * Add a gust
 * @param {AudioBank} audio Game audio
 * @param {Random} random A randomizer
 */
Gusts.prototype.createGust = function(audio, random) {
    const slant = this.SAMPLER_SLANT.sample(random.getFloat());
    const height = this.SAMPLER_HEIGHT.sample(random.getFloat()) * this.constellation.height;
    const distance = this.SAMPLER_DISTANCE.sample(random.getFloat()) * this.constellation.width;
    const origin = new Vector2(
        distance * -.5 + this.constellation.width * random.getFloat(),
        height * -.5 + this.constellation.height * random.getFloat());
    const gust = new Gust(
        origin,
        new Vector2(
            origin.x + height * slant,
            origin.y + height),
        distance,
        this.SAMPLER_SPEED.sample(random.getFloat()),
        this.intensity,
        random);
    const pan = Math.max(-1, Math.min(1, (gust.getFocus() / this.constellation.width) * 2 - 1));

    this.gusts.push(gust);

    // TODO: Determine when gusts play sound, and how loud
    // audio.effectGust.play(audio.effectGust.engine.transformPan(pan));
};

/**
 * Set the frequency intensity
 * @param {Number} frequency The wind frequency in the range [0, 1]
 * @param {Number} intensity The wind intensity in the range [0, 1]
 */
Gusts.prototype.setWind = function(frequency, intensity) {
    this.frequency = frequency;
    this.intensity = intensity;
};

/**
 * Update the weather
 * @param {Air} air The air
 * @param {AudioBank} audio Game audio
 * @param {Random} random A randomizer
 */
Gusts.prototype.update = function(air, audio, random) {
    if ((this.windTime -= 1) < 0) {
        if (random.getFloat() < this.frequency)
            this.createGust(audio, random);

        this.windTime = Math.round(this.SAMPLER_TIME.sample(random.getFloat()));
    }

    for (let gust = this.gusts.length; gust-- > 0;)
        if (this.gusts[gust].update(air))
            this.gusts.splice(gust, 1);
};