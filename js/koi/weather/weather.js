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

Weather.prototype.WIND_TIME_MIN = 1;
Weather.prototype.WIND_TIME_MAX = 32;

/**
 * Update the weather
 * @param {Air} air The air
 * @param {Water} water The water
 * @param {Random} random A randomizer
 */
Weather.prototype.update = function(air, water, random) {
    if ((this.windTime -= 1) < 0) {
        if (this.wind < random.getFloat())
            this.gusts.push(
                new Gust(
                    new Vector2(0, 0),
                    new Vector2(3, this.constellation.height),
                    this.constellation.width,
                    0.3,
                    random));

        this.windTime = this.WIND_TIME_MIN + (this.WIND_TIME_MAX - this.WIND_TIME_MIN) * random.getFloat();
    }

    for (let gust = this.gusts.length; gust-- > 0;)
        if (this.gusts[gust].update(air))
            this.gusts.splice(gust, 1);
};