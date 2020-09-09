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
    this.transition = this.transitionPrevious = this.transitionRendered = 1;
    this.filter = new Color(1, 1, 1);
    this.filterPrevious = this.filterCurrent = this.COLOR_FILTER_SUNNY;

    this.applyState(this.state.state);
};

Weather.prototype.TRANSITION_SPEED = .015;
Weather.prototype.COLOR_FILTER_SUNNY = Color.fromCSS("--color-ambient-sunny");
Weather.prototype.COLOR_FILTER_OVERCAST = Color.fromCSS("--color-ambient-overcast");
Weather.prototype.COLOR_FILTER_DRIZZLE = Color.fromCSS("--color-ambient-drizzle");
Weather.prototype.COLOR_FILTER_RAIN = Color.fromCSS("--color-ambient-rain");
Weather.prototype.COLOR_FILTER_THUNDERSTORM = Color.fromCSS("--color-ambient-thunderstorm");

/**
 * Set the weather state
 * @param {WeatherState} state The weather state
 */
Weather.prototype.setState = function(state) {
    this.state = state;

    this.applyState(state.lastState);
    this.applyState(state.state);

    this.transition = this.transitionPrevious = Math.min(1, state.time / (1 / this.TRANSITION_SPEED));
    this.filter.r = this.filterPrevious.r + (this.filterCurrent.r - this.filterPrevious.r) * this.transition;
    this.filter.g = this.filterPrevious.g + (this.filterCurrent.g - this.filterPrevious.g) * this.transition;
    this.filter.b = this.filterPrevious.b + (this.filterCurrent.b - this.filterPrevious.b) * this.transition;
};

/**
 * Get the weather state
 * @returns {WeatherState} The weather state
 */
Weather.prototype.getState = function() {
    return this.state;
};

/**
 * Set the filter color for the current weather
 * @param {Color} filter The filter color
 */
Weather.prototype.setFilter = function(filter) {
    this.filterPrevious = this.filterCurrent;
    this.filterCurrent = filter;
};

/**
 * Activate the sunny state
 */
Weather.prototype.setSunny = function() {
    this.setFilter(this.COLOR_FILTER_SUNNY);
};

/**
 * Activate the overcast state
 */
Weather.prototype.setOvercast = function() {
    this.setFilter(this.COLOR_FILTER_OVERCAST);
};

/**
 * Activate the drizzle state
 */
Weather.prototype.setDrizzle = function() {
    this.setFilter(this.COLOR_FILTER_DRIZZLE);

    this.rain.start(.07, .06);
};

/**
 * Activate the rain state
 */
Weather.prototype.setRain = function() {
    this.setFilter(this.COLOR_FILTER_RAIN);

    this.rain.start(.08, .09);
};

/**
 * Activate the thunderstorm state
 */
Weather.prototype.setThunderstorm = function() {
    this.setFilter(this.COLOR_FILTER_THUNDERSTORM);

    this.rain.start(.1, .15);
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
        case this.state.ID_OVERCAST:
            this.setOvercast();

            break;
        case this.state.ID_DRIZZLE:
            this.setDrizzle();

            break;
        case this.state.ID_RAIN:
            this.setRain();

            break;
        case this.state.ID_THUNDERSTORM:
            this.setThunderstorm();

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
        case this.state.ID_OVERCAST:
            if (this.state.lastState !== this.state.ID_SUNNY &&
                this.state.lastState !== this.state.ID_OVERCAST &&
                this.transition !== 1)
                this.rain.update(water, 1 - this.transition);

            break;
        case this.state.ID_DRIZZLE:
        case this.state.ID_RAIN:
        case this.state.ID_THUNDERSTORM:
            this.rain.update(water, this.transition);

            break;
    }

    this.gusts.update(air, random);
};

/**
 * Render weather effects
 * @param {Drops} drops The drops renderer
 * @param {Number} time The interpolation factor
 * @returns {Boolean} True if the filter color has changed
 */
Weather.prototype.render = function(drops, time) {
    const transition = this.transitionPrevious + (this.transition - this.transitionPrevious) * time;

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    console.log(this.state.state);
    switch (this.state.state) {
        case this.state.ID_SUNNY:
        case this.state.ID_OVERCAST:
            if (this.state.lastState !== this.state.ID_SUNNY &&
                this.state.lastState !== this.state.ID_OVERCAST &&
                transition !== 1)
                this.rain.render(drops, 1 - transition, time);

            break;
        case this.state.ID_DRIZZLE:
        case this.state.ID_RAIN:
        case this.state.ID_THUNDERSTORM:
            this.rain.render(drops, transition, time);

            break;
    }

    this.gl.disable(this.gl.BLEND);

    if (transition !== this.transitionRendered) {
        this.filter.r = this.filterPrevious.r + (this.filterCurrent.r - this.filterPrevious.r) * transition;
        this.filter.g = this.filterPrevious.g + (this.filterCurrent.g - this.filterPrevious.g) * transition;
        this.filter.b = this.filterPrevious.b + (this.filterCurrent.b - this.filterPrevious.b) * transition;

        this.transitionRendered = transition;

        return true;
    }

    this.transitionRendered = transition;

    return false;
};

/**
 * Free all weather related resources
 */
Weather.prototype.free = function() {
    this.rain.free();
};