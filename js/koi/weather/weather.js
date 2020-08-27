/**
 * The weather controller
 * @param {WebGLRenderingContext} gl A WebGL rendering context
 * @param {Constellation} constellation The constellation
 * @param {Random} random A randomizer
 * @constructor
 */
const Weather = function(gl, constellation, random) {
    this.gl = gl;
    this.gusts = new Gusts(constellation);
    this.rain = new Rain(gl, constellation, random);
    this.state = new WeatherState();
    this.stateTime = this.STATE_TIME - 1; // TODO: Move this to weather state
};

Weather.prototype.STATE_TIME = 70;

/**
 * Set the weather state
 * @param {WeatherState} state The weather state
 */
Weather.prototype.setState = function(state) {
    this.state = state;
};

/**
 * Get the weather state
 * @returns {WeatherState} The weather state
 */
Weather.prototype.getState = function() {
    return this.state;
};

/**
 * Activate the sunny state
 */
Weather.prototype.setSunny = function() {
    this.rain.fadeOut();
    console.log("Start sun");
};

/**
 * Activate the rain state
 */
Weather.prototype.setRain = function() {
    this.rain.fadeIn(.05, .15);
    console.log("Start rain");
};

/**
 * Update the weather
 * @param {Air} air The air
 * @param {Water} water The water
 * @param {Random} random A randomizer
 */
Weather.prototype.update = function(air, water, random) {
    if (++this.stateTime === this.STATE_TIME) {
        this.stateTime = 0;

        if (this.state.transition(random)) {
            switch (this.state.state) {
                case this.state.ID_SUNNY:
                    this.setSunny();

                    break;
                case this.state.ID_RAIN:
                    this.setRain();

                    break;
            }
        }
    }

    this.gusts.update(air, random);
    this.rain.update(water);
};

/**
 * Render weather effects
 * @param {Drops} drops The drops renderer
 * @param {Number} time The interpolation factor
 */
Weather.prototype.render = function(drops, time) {
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.rain.render(drops, time);

    this.gl.disable(this.gl.BLEND);
};

/**
 * Free all weather related resources
 */
Weather.prototype.free = function() {
    this.rain.free();
};