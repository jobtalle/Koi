/**
 * A load screen
 * @param {HTMLElement} element The container element
 * @param {HTMLElement} elementGraphics The element to place graphics in
 * @param {HTMLElement} elementSlots The save slots element
 * @param {HTMLElement} elementButtonSettings The element to build the settings button in
 * @param {HTMLElement} wrapper The wrapper to toggle fullscreen on
 * @param {Boolean} loadDiscord If set to true, the Discord button will be shown
 * @param {Boolean} loadFullscreen If set to true, the Fullscreen button will be shown
 * @constructor
 */
const Loader = function(
    element,
    elementGraphics,
    elementSlots,
    elementButtonSettings,
    wrapper,
    loadDiscord,
    loadFullscreen) {
    this.element = element;
    this.icon = new LoaderIcon();
    this.elementSlots = elementSlots;
    this.elementButtonSettings = elementButtonSettings;
    this.elementDiscord = new LoaderDiscord();
    this.resumables = null;
    this.outstanding = 0;
    this.finished = 0;
    this.released = false;
    this.onFinish = null;
    this.onNewGame = null;
    this.onContinue = null;
    this.menu = null;
    this.fullscreen = new LoaderFullscreen(wrapper);
    this.loadFullscreen = loadFullscreen;
    this.overlayCanvas = document.createElement("canvas");
    this.element.appendChild(this.overlayCanvas);

    this.slots = null;

    element.appendChild(this.elementDiscord.element);

    if (loadFullscreen)
        element.appendChild(this.fullscreen.element);

    elementGraphics.appendChild(this.icon.element);

    const loop = () => {
        this.overlayCanvas.getContext("2d").clearRect(
            0,
            0,
            this.overlayCanvas.width,
            this.overlayCanvas.height);

        if (this.element.className !== this.CLASS_FINISHED)
            requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
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

Loader.prototype.LANG_SETTINGS = "SETTINGS";
Loader.prototype.CLASS_LOADED = "loaded";
Loader.prototype.CLASS_FINISHED = "finished";
Loader.prototype.ID_DISCORD = "loader-discord";
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
Loader.prototype.setResumables = function(resumables) {
    this.resumables = resumables;
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
    this.element.removeChild(this.overlayCanvas);

    setTimeout(() => {
        this.element.style.display = "none";
    }, 1000 * this.TRANSITION);

    if (this.menu)
        this.menu.addQuitOption();
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
    if (this.loadFullscreen)
        this.fullscreen.setLoaded();

    const onNewGame = index => {
        this.onNewGame(index);
        this.onFinish();
        this.hide();
    };

    const onContinue = index => {
        this.onContinue(index);
        this.onFinish();
        this.hide();
    };

    this.slots = [
        new LoaderSlot(0, "1", onNewGame, this.resumables[0] ? onContinue : null),
        new LoaderSlot(1, "2", onNewGame, this.resumables[1] ? onContinue : null),
        new LoaderSlot(2, "3", onNewGame, this.resumables[2] ? onContinue : null)
    ];

    for (const slot of this.slots)
        this.elementSlots.appendChild(slot.element);

    setTimeout(() => {
        for (const slot of this.slots)
            slot.element.classList.add(this.CLASS_LOADED);
    }, 100);

    setTimeout(() => {
        this.elementButtonSettings.appendChild(this.createButtonSettings());
        this.elementButtonSettings.classList.add(this.CLASS_LOADED);
    }, this.BUTTON_DELAY * 1000);
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
 * Set the function to call when an existing game should continue
 * @param {Function} onContinue A function that continues an existing game
 */
Loader.prototype.setContinueCallback = function(onContinue) {
    this.onContinue = onContinue;
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
