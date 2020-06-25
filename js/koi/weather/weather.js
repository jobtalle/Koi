/**
 * The weather controller
 * @param {Constellation} constellation The constellation
 * @constructor
 */
const Weather = function(constellation) {
    this.constellation = constellation;
    this.wind = .5;
    this.windTime = this.WIND_TIME_MIN;
    this.gusts = [];
};

Weather.prototype.WIND_TIME_MIN = 5;
Weather.prototype.WIND_TIME_MAX = 20;
Weather.prototype.GUST_HEIGHT_MIN = .7;
Weather.prototype.GUST_HEIGHT_MAX = 1.3;
Weather.prototype.GUST_SLANT_MIN = -.3;
Weather.prototype.GUST_SLANT_MAX = .3;
Weather.prototype.GUST_DISTANCE_MIN = .6;
Weather.prototype.GUST_DISTANCE_MAX = 1.4;
Weather.prototype.GUST_SPEED_MIN = .15;
Weather.prototype.GUST_SPEED_MAX = .3;

/**
 * Add a gust
 * @param {Air} air The air
 * @param {Random} random A randomizer
 */
Weather.prototype.createGust = function(air, random) {
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
            .05,
            random));
};

/**
 * Update the weather
 * @param {Air} air The air
 * @param {Water} water The water
 * @param {Random} random A randomizer
 */
Weather.prototype.update = function(air, water, random) {
    if ((this.windTime -= 1) < 0) {
        if (this.wind < random.getFloat())
            this.createGust(air, random);

        this.windTime = this.WIND_TIME_MIN + (this.WIND_TIME_MAX - this.WIND_TIME_MIN) * random.getFloat();
    }

    for (let gust = this.gusts.length; gust-- > 0;)
        if (this.gusts[gust].update(air))
            this.gusts.splice(gust, 1);
};