/**
 * A load screen
 * @param {HTMLElement} element The container element
 * @param {HTMLElement} elementButton The element to build the start button in
 * @param {HTMLElement} elementBar The loading bar element
 * @constructor
 */
const Loader = function(element, elementButton, elementBar) {
    this.element = element;
    this.elementButton = elementButton;
    this.elementBar = elementBar;
    this.outstanding = 0;
    this.finished = 0;
    this.released = false;
    this.onFinish = null;
};

/**
 * A loader requirement
 * @param {Loader} loader The loader
 * @param {Number} weight The requirement weight
 * @constructor
 */
Loader.Requirement = function(loader, weight) {
    this.loader = loader;
    this.weight = weight;

    loader.add(weight);
};

/**
 * Satisfy this loader requirement
 */
Loader.Requirement.prototype.satisfy = function() {
    this.loader.finish(this.weight);
};

Loader.prototype.LANG_START = "START";
Loader.prototype.CLASS_FINISHED = "finished";

/**
 * Update the loading bar element after loaded content has changed
 */
Loader.prototype.updateBar = function() {
    this.elementBar.style.width = (100 * this.finished / this.outstanding).toFixed(2) + "%";
};

/**
 * Create the start button
 * @returns {HTMLButtonElement} The start button
 */
Loader.prototype.createButton = function() {
    const element = document.createElement("button");

    element.appendChild(document.createTextNode(language.get(this.LANG_START)));
    element.onclick = () => {
        this.onFinish();

        this.element.className = this.CLASS_FINISHED;
    };

    return element;
}

/**
 * Finish loading
 */
Loader.prototype.complete = function() {
    this.elementButton.appendChild(this.createButton());
};

/**
 * Check whether the loader has finished loading
 * @returns {Boolean} True if the loader has already finished
 */
Loader.prototype.hasFinished = function() {
    return this.released;
};

/**
 * Indicate that the loader may now finish
 * @param {Function} onFinish A function to call when loading has finished
 */
Loader.prototype.setFinishCallback = function(onFinish) {
    this.onFinish = onFinish;

    if (this.outstanding === this.finished)
        this.complete();

    this.released = true;
};

/**
 * Add loading contents
 * @param {Number} weight The amount of weight to add
 */
Loader.prototype.add = function(weight) {
    this.outstanding += weight;

    this.updateBar();
};

/**
 * Finish loading progress
 * @param {Number} weight The amount of weight that has been finished
 */
Loader.prototype.finish = function(weight) {
    this.finished += weight;

    this.updateBar();

    if (this.released && this.finished === this.outstanding)
        this.complete();
};

/**
 * Create a requirement for this loader to finish
 * @param {Number} weight The weight of the requirement, which should be higher if loading takes longer
 * @returns {Loader.Requirement} A requirement that must be satisfied after loading has finished
 */
Loader.prototype.createRequirement = function(weight) {
    return new Loader.Requirement(this, weight);
};