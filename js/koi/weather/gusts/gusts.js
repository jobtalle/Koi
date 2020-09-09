/**
 * The frequency gusts system
 * @param {Constellation} constellation The constellation
 * @constructor
 */
const Gusts = function(constellation) {
    this.frequency = 0;
    this.intensity = 0;
    this.windTime = this.WIND_TIME_MIN;
    this.constellation = constellation;
    this.gusts = [];
};

Gusts.prototype.WIND_TIME_MIN = 10;
Gusts.prototype.WIND_TIME_MAX = 15;
Gusts.prototype.GUST_HEIGHT_MIN = .9;
Gusts.prototype.GUST_HEIGHT_MAX = 1.6;
Gusts.prototype.GUST_SLANT_MIN = -.3;
Gusts.prototype.GUST_SLANT_MAX = .3;
Gusts.prototype.GUST_DISTANCE_MIN = .6;
Gusts.prototype.GUST_DISTANCE_MAX = 1.4;
Gusts.prototype.GUST_SPEED_MIN = .15;
Gusts.prototype.GUST_SPEED_MAX = .3;

/**
 * Add a gust
 * @param {Air} air The air
 * @param {Random} random A randomizer
 */
Gusts.prototype.createGust = function(air, random) {
    const slant = this.GUST_SLANT_MIN + (this.GUST_SLANT_MAX - this.GUST_SLANT_MIN) * random.getFloat();
    const height = (this.GUST_HEIGHT_MIN + (this.GUST_HEIGHT_MAX - this.GUST_HEIGHT_MIN) * random.getFloat()) *
        this.constellation.height;
    const distance = (this.GUST_DISTANCE_MIN + (this.GUST_DISTANCE_MAX - this.GUST_DISTANCE_MIN) * random.getFloat()) *
        this.constellation.width;
    const origin = new Vector2(
        distance * -.5 + this.constellation.width * random.getFloat(),
        height * -.5 + this.constellation.height * random.getFloat());

    this.gusts.push(
        new Gust(
            origin,
            new Vector2(
                origin.x + height * slant,
                origin.y + height),
            distance,
            this.GUST_SPEED_MIN + (this.GUST_SPEED_MAX - this.GUST_SPEED_MIN) * random.getFloat(),
            this.intensity,
            random));
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
 * @param {Random} random A randomizer
 */
Gusts.prototype.update = function(air, random) {
    if ((this.windTime -= 1) < 0) {
        if (random.getFloat() < this.frequency)
            this.createGust(air, random);

        this.windTime = this.WIND_TIME_MIN + (this.WIND_TIME_MAX - this.WIND_TIME_MIN) * random.getFloat();
    }

    for (let gust = this.gusts.length; gust-- > 0;)
        if (this.gusts[gust].update(air))
            this.gusts.splice(gust, 1);
};