/**
 * A load screen
 * @param {HTMLElement} element The container element
 * @param {HTMLElement} elementGraphics The element to place graphics in
 * @param {HTMLElement} elementButtonStart The element to build the start button in
 * @param {HTMLElement} elementButtonNew The element to build the new game button in
 * @param {HTMLElement} elementButtonSettings The element to build the settings button in
 * @param {HTMLElement} wrapper The wrapper to toggle fullscreen on
 * @constructor
 */
const Loader = function(
    element,
    elementGraphics,
    elementButtonStart,
    elementButtonNew,
    elementButtonSettings,
    wrapper) {
    this.element = element;
    this.icon = new LoaderIcon();
    this.elementButtonStart = elementButtonStart;
    this.elementButtonNew = elementButtonNew;
    this.elementButtonSettings = elementButtonSettings;
    this.loadedPrevious = false;
    this.outstanding = 0;
    this.finished = 0;
    this.released = false;
    this.onFinish = null;
    this.onNewGame = null;
    this.menu = null;
    this.fullscreen = new LoaderFullscreen(wrapper);

    element.appendChild(this.fullscreen.element);
    elementGraphics.appendChild(this.icon.element);
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
Loader.prototype.LANG_CONTINUE = "CONTINUE";
Loader.prototype.LANG_NEW = "NEW";
Loader.prototype.LANG_CONFIRM = "CONFIRM";
Loader.prototype.LANG_SETTINGS = "SETTINGS";
Loader.prototype.CLASS_LOADED = "loaded";
Loader.prototype.CLASS_FINISHED = "finished";
Loader.prototype.CLASS_BUTTON_CONFIRM = "confirm";
Loader.prototype.BUTTON_DELAY = .37;
Loader.prototype.TRANSITION = StyleUtils.getFloat("--loader-fade-out");

/**
 * Set the menu
 * @param {Menu} menu The menu
 */
Loader.prototype.setMenu = function(menu) {
    this.menu = menu;
};

/**
 * Indicate that a previous game has been loaded
 */
Loader.prototype.setLoadedPrevious = function() {
    this.loadedPrevious = true;
};

/**
 * Update the loading bar element after loaded content has changed
 */
Loader.prototype.updateBar = function() {
    // There is no loading bar.
};

/**
 * Hide the loader GUI
 */
Loader.prototype.hide = function() {
    this.element.className = this.CLASS_FINISHED;

    setTimeout(() => {
        this.element.style.display = "none";
    }, 1000 * this.TRANSITION);

    if (this.menu)
        this.menu.addQuitOption();
};

/**
 * Create the start button
 * @returns {HTMLButtonElement} The start button
 */
Loader.prototype.createButtonStart = function() {
    const element = document.createElement("button");

    element.appendChild(document.createTextNode(language.get(this.loadedPrevious ? this.LANG_CONTINUE : this.LANG_START)));
    element.onclick = () => {
        this.onFinish();

        this.hide();
    };

    return element;
};

/**
 * Create the new game button
 * @returns {HTMLButtonElement} The new game button
 */
Loader.prototype.createButtonNew = function() {
    const element = document.createElement("button");

    element.innerText = language.get(this.LANG_NEW);
    element.onclick = () => {
        if (element.classList.contains(this.CLASS_BUTTON_CONFIRM)) {
            if (this.onNewGame) {
                this.onNewGame();
                this.onFinish();

                this.hide();
            }
        }
        else {
            element.classList.add(this.CLASS_BUTTON_CONFIRM);
            element.innerText = language.get(this.LANG_CONFIRM);
        }
    };

    return element;
};

/**
 * Create the settings button
 * @returns {HTMLButtonElement} The settings button
 */
Loader.prototype.createButtonSettings = function() {
    const element = document.createElement("button");

    element.innerText = language.get(this.LANG_SETTINGS);
    element.onclick = () => {
        this.menu.show();
    };

    return element;
};

/**
 * Finish loading
 */
Loader.prototype.complete = function() {
    this.fullscreen.setLoaded();
    this.elementButtonStart.classList.add(this.CLASS_LOADED);
    this.elementButtonStart.appendChild(this.createButtonStart());

    setTimeout(() => {
        this.elementButtonSettings.appendChild(this.createButtonSettings());
        this.elementButtonSettings.classList.add(this.CLASS_LOADED);
    }, this.BUTTON_DELAY * 1000);

    if (this.loadedPrevious)
        setTimeout(() => {
            this.elementButtonNew.appendChild(this.createButtonNew());
            this.elementButtonNew.classList.add(this.CLASS_LOADED);
        }, this.BUTTON_DELAY * 2000);
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
 * Set the function to call when a new game should be created, overwriting the current one
 * @param {Function} onNewGame A function that creates a new game
 */
Loader.prototype.setNewGameCallback = function(onNewGame) {
    this.onNewGame = onNewGame;
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