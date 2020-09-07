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
    this.transition = this.transitionPrevious = 1;

    this.applyState(this.state.state);
};

Weather.prototype.TRANSITION_SPEED = .015;
Weather.prototype.COLOR_FILTER_SUNNY = Color.fromCSS("--color-ambient-sunny");
Weather.prototype.COLOR_FILTER_DRIZZLE = Color.fromCSS("--color-ambient-drizzle");

/**
 * Set the weather state
 * @param {WeatherState} state The weather state
 */
Weather.prototype.setState = function(state) {
    this.state = state;

    this.applyState(state.lastState);
    this.applyState(state.state);

    this.transition = this.transitionPrevious = Math.min(1, state.time / (1 / this.TRANSITION_SPEED));
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

};

/**
 * Activate the rain state
 */
Weather.prototype.setRain = function() {
    this.rain.start(.07, .06);
};

/**
 * Apply weather state effects
 * @param {Number} state The state ID
 */
Weather.prototype.applyState = function(state) {
    this.transition = this.transitionPrevious = 0;

    switch (state) {
        case this.state.ID_SUNNY:
            this.setSunny();

            break;
        case this.state.ID_RAIN:
            this.setRain();

            break;
    }
};

/**
 * Update the weather
 * @param {Air} air The air
 * @param {Water} water The water
 * @param {Random} random A randomizer
 */
Weather.prototype.update = function(air, water, random) {
    if (this.state.update(random))
        this.applyState(this.state.state);

    this.transitionPrevious = this.transition;

    if (this.transition < 1)
        if ((this.transition += this.TRANSITION_SPEED) > 1)
            this.transition = 1;

    switch (this.state.state) {
        case this.state.ID_SUNNY:
            if (this.state.lastState === this.state.ID_RAIN && this.transition !== 1)
                this.rain.update(water, 1 - this.transition);

            break;
        case this.state.ID_RAIN:
            this.rain.update(water, this.transition);

            break;
    }

    this.gusts.update(air, random);
};

/**
 * Render weather effects
 * @param {Drops} drops The drops renderer
 * @param {Number} time The interpolation factor
 */
Weather.prototype.render = function(drops, time) {
    const transition = this.transitionPrevious + (this.transition - this.transitionPrevious) * time;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    switch (this.state.state) {
        case this.state.ID_SUNNY:
            if (this.state.lastState === this.state.ID_RAIN && transition !== 1)
                this.rain.render(drops, 1 - transition, time);

            break;
        case this.state.ID_RAIN:
            this.rain.render(drops, transition, time);

            break;
    }

    this.gl.disable(this.gl.BLEND);
};

/**
 * Free all weather related resources
 */
Weather.prototype.free = function() {
    this.rain.free();
};