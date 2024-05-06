/**
 * A koi card
 * @param {FishBody} body The fish body represented by this card
 * @param {Vector2} position The initial card position
 * @param {Number} [angle] The initial card angle
 * @constructor
 */
const Card = function(body, position, angle = 0) {
    this.body = body;
    this.position = position;
    this.positionPrevious = position.copy();
    this.angle = this.anglePrevious = angle;
    this.previewAnimation = this.createPreviewAnimation();
    this.previewFrame = this.createPreviewFrame(this.previewAnimation);
    this.previewURL = null;
    this.element = this.createElement(this.previewFrame);
    this.initialized = false;
    this.codeViewer = null;
    this.systems = null;
    this.audio = null;

    this.updatePosition();
};

Card.prototype.CLASS = "card-shape card";
Card.prototype.CLASS_PREVIEW_FRAME = "preview-frame";
Card.prototype.CLASS_PREVIEW_ANIMATION = "preview-animation";
Card.prototype.CLASS_COLORS = "colors";
Card.prototype.CLASS_COLOR = "color";
Card.prototype.CLASS_COLORS_WRAPPER = "colors-wrapper";
Card.prototype.CLASS_COLOR_FILL = "fill-";
Card.prototype.CLASS_INFO = "info";
Card.prototype.CLASS_INFO_PROPERTY = "property";
Card.prototype.CLASS_INFO_TEXT = "text";
Card.prototype.CLASS_INFO_BACKGROUND = "background";
Card.prototype.CLASS_INFO_LABEL = "label";
Card.prototype.CLASS_INFO_VALUE = "value";
Card.prototype.CLASS_JAPANESE = "japanese";
Card.prototype.SCALE = StyleUtils.getFloat("--card-scale");
Card.prototype.WIDTH_DEFAULT = StyleUtils.getInt("--card-width-default");
Card.prototype.HEIGHT_DEFAULT = StyleUtils.getInt("--card-height-default");
Card.prototype.WIDTH = Card.prototype.WIDTH_DEFAULT * Card.prototype.SCALE;
Card.prototype.HEIGHT = Card.prototype.HEIGHT_DEFAULT * Card.prototype.SCALE;
Card.prototype.RATIO = Card.prototype.WIDTH / Card.prototype.HEIGHT;
Card.prototype.LANG_WEIGHT = "INFO_WEIGHT";
Card.prototype.LANG_LENGTH = "INFO_LENGTH";
Card.prototype.LANG_AGE = "INFO_AGE";
Card.prototype.LANG_FRY = "INFO_FRY";
Card.prototype.LANG_UNIT_WEIGHT = "UNIT_WEIGHT";
Card.prototype.LANG_UNIT_LENGTH = "UNIT_LENGTH";
Card.prototype.LANG_UNIT_TIME = "UNIT_TIME";
Card.prototype.REQUIREMENT_WEIGHT = 5;

/**
 * Deserialize a card
 * @param {BinBuffer} buffer The buffer to deserialize from
 * @param {Vector2} [position] The position to deserialize the card at
 * @param {Number} [angle] The card angle
 * @returns {Card} The deserialized card
 * @throws {RangeError} A range error if deserialized values are not valid
 */
Card.deserialize = function(buffer, position = new Vector2(), angle = 0) {
    return new Card(FishBody.deserialize(buffer), position, angle);
};

/**
 * Serialize the card
 * @param {BinBuffer} buffer The buffer to serialize to
 */
Card.prototype.serialize = function(buffer) {
    this.body.serialize(buffer);
};

/**
 * Set the code viewer
 * @param {CodeViewer} codeViewer The code viewer
 */
Card.prototype.setCodeViewer = function(codeViewer) {
    this.codeViewer = codeViewer;
};

/**
 * Set the systems
 * @param {Systems} systems The render systems
 */
Card.prototype.setSystems = function(systems) {
    this.systems = systems;
};

/**
 * Set the game audio
 * @param {AudioBank} audio Game audio
 */
Card.prototype.setAudio = function(audio) {
    this.audio = audio;
};

/**
 * Call this function when the card is made visible
 * @param {Preview} preview A preview renderer
 * @param {Atlas} atlas The atlas
 * @param {Bodies} bodies The bodies renderer
 * @param {RandomSource} [randomSource] The random source, required if the body may not be written to the atlas
 */
Card.prototype.initialize = function(
    preview,
    atlas,
    bodies,
    randomSource = null) {
    if (this.initialized)
        return;

    const requirement = loader.hasFinished() ? null : loader.createRequirement(this.REQUIREMENT_WEIGHT);

    this.initialized = true;

    let createdTexture = false;

    if (!this.body.pattern.region) {
        this.body.initializeSpine();

        atlas.write(this.body.pattern, randomSource);

        createdTexture = true;
    }

    preview.render(this.body, atlas, bodies).toBlob(blob => {
        if (!this.initialized) {
            if (requirement)
                requirement.satisfy();

            return;
        }

        this.previewURL = URL.createObjectURL(blob);
        this.previewAnimation.style.backgroundImage = "url(" + this.previewURL + ")";

        if (requirement)
            requirement.satisfy();
    });

    if (createdTexture)
        this.body.pattern.free(atlas);
};

/**
 * Render the card, updates every refresh
 * @param {Number} time The amount of time since the last update
 */
Card.prototype.render = function(time) {
    this.updatePosition(time);
};

/**
 * Move the card to a position
 * @param {Number} x The X position in pixels
 * @param {Number} y The Y position in pixels
 */
Card.prototype.moveTo = function(x, y) {
    this.position.x = x;
    this.position.y = y;

    this.positionPrevious.set(this.position);
};

/**
 * Move the card towards a position
 * @param {Number} x The X position to move towards
 * @param {Number} y The Y position to move towards
 * @param {Number} interpolationFactor The interpolation factor
 */
Card.prototype.move = function(x, y, interpolationFactor) {
    this.positionPrevious.set(this.position);

    this.position.x += (x - this.position.x) * interpolationFactor;
    this.position.y += (y - this.position.y) * interpolationFactor;
};

/**
 * Rotate the card towards a target
 * @param {Number} target The target angle
 * @param {Number} interpolationFactor The interpolation factor
 */
Card.prototype.rotate = function(target, interpolationFactor) {
    this.anglePrevious = this.angle;
    this.angle += (target - this.angle) * interpolationFactor;
};

/**
 * Set the position of this card instantly
 * @param {Vector2} position The new position
 */
Card.prototype.setPosition = function(position) {
    this.position.set(position);
    this.positionPrevious.set(position);
};

/**
 * Set the rotation of this card instantly
 * @param {Number} rotation The rotation
 */
Card.prototype.setRotation = function(rotation) {
    this.angle = this.anglePrevious = rotation;
};

/**
 * Update this cards element position
 * @param {Number} time The amount of time since the last update
 */
Card.prototype.updatePosition = function(time = 0) {
    const x = this.positionPrevious.x + (this.position.x - this.positionPrevious.x) * time;
    const y = this.positionPrevious.y + (this.position.y - this.positionPrevious.y) * time;
    const angle = this.anglePrevious + (this.angle - this.anglePrevious) * time;

    this.element.style.transform = "translate(" + x + "px," + y + "px)";

    if (this.angle !== 0)
        this.element.style.transform += "rotate(" + angle + "rad)";
};

/**
 * Set the transform to fit inside the page slot
 * @param {Number} slotWidth The width of a page slot
 */
Card.prototype.transformSlot = function(slotWidth) {
    this.element.style.transform = "scale(" + (slotWidth / this.WIDTH) + ")";
};

/**
 * Create the preview animation element
 * @returns {HTMLDivElement} The preview animation element
 */
Card.prototype.createPreviewAnimation = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_PREVIEW_ANIMATION;

    return element;
};

/**
 * Create the preview frame
 * @param {HTMLDivElement} previewAnimation The preview animation element
 * @returns {HTMLDivElement} The preview frame element
 */
Card.prototype.createPreviewFrame = function(previewAnimation) {
    const element = document.createElement("div");

    element.className = this.CLASS_PREVIEW_FRAME;

    element.appendChild(previewAnimation);

    return element;
};

/**
 * Create an element describing a fish property
 * @param {String} name The property name
 * @param {String} value The property value
 * @returns {HTMLElement} The property element
 */
Card.prototype.createProperty = function(name, value) {
    const element = document.createElement("div");
    const background = document.createElement("div");
    const text = document.createElement("div");
    const spanLabel = document.createElement("span");
    const spanValue = document.createElement("span");

    spanLabel.className = this.CLASS_INFO_LABEL;
    spanLabel.appendChild(document.createTextNode(name));

    spanValue.className = this.CLASS_INFO_VALUE;
    spanValue.appendChild(document.createTextNode(value));

    background.className = this.CLASS_INFO_BACKGROUND;

    text.className = this.CLASS_INFO_TEXT;
    text.appendChild(spanLabel);
    text.appendChild(spanValue);

    element.className = this.CLASS_INFO_PROPERTY;
    element.appendChild(background);
    element.appendChild(text);

    return element;
};

/**
 * Create a color element
 * @param {Number} paletteIndex The palette index for this color
 * @returns {HTMLDivElement} The color element
 */
Card.prototype.createColor = function(paletteIndex) {
    const element = document.createElement("div");

    element.className = this.CLASS_COLOR;
    element.classList.add(this.CLASS_COLOR_FILL + Palette.COLOR_NAMES[paletteIndex]);

    return element;
}

/**
 * Create the colors element
 * @returns {HTMLDivElement} The colors element
 */
Card.prototype.createColors = function() {
    const element = document.createElement("div");
    const colorsWrapper = document.createElement("div");

    colorsWrapper.className = this.CLASS_COLORS_WRAPPER;
    colorsWrapper.appendChild(this.createColor(this.body.pattern.base.paletteIndex));

    for (const layer of this.body.pattern.layers)
        colorsWrapper.appendChild(this.createColor(layer.paletteIndex));

    element.className = this.CLASS_COLORS;
    element.appendChild(colorsWrapper);

    return element;
};

/**
 * Create the info element
 * @returns {HTMLDivElement} The info element
 */
Card.prototype.createInfo = function() {
    const element = document.createElement("div");
    const ageMinutes = this.body.getAge() / 60;

    element.className = this.CLASS_INFO;
    element.appendChild(this.createProperty(
        language.get(this.LANG_WEIGHT),
        this.body.getWeight().toFixed(2) + " " + language.get(this.LANG_UNIT_WEIGHT)));
    element.appendChild(this.createProperty(
        language.get(this.LANG_LENGTH),
        (this.body.getLength()).toFixed(1).toString() + " " + language.get(this.LANG_UNIT_LENGTH)));

    if (chosenLocale === "ja" || chosenLocale === "zh")
        element.classList.add(this.CLASS_JAPANESE);

    if (ageMinutes < 1)
        element.appendChild(this.createProperty(
            language.get(this.LANG_AGE),
            language.get(this.LANG_FRY)));
    else if (ageMinutes > 60)
        element.appendChild(this.createProperty(
            language.get(this.LANG_AGE),
            "> 60 " + language.get(this.LANG_UNIT_TIME)));
    else
        element.appendChild(this.createProperty(
            language.get(this.LANG_AGE),
            Math.round(ageMinutes).toString() + " " + language.get(this.LANG_UNIT_TIME)));

    return element;
};

/**
 * Create the download button
 * @returns {HTMLButtonElement} The download button
 */
Card.prototype.createDownload = function() {
    const button = document.createElement("button");

    new CodeIcon(button);

    button.addEventListener("mousedown", event => {
        event.stopImmediatePropagation();
    });

    button.onclick = () => {
        this.audio.effectClick.play();

        this.codeViewer.view(new CodeWriter(
            this.body,
            this.systems.still,
            this.systems.atlas,
            this.systems.bodies,
            this.systems.randomSource).write(),
            this.audio);
    };

    return button;
};

/**
 * Create an HTML element for this card
 * @param {HTMLElement} previewFrame The preview frame element
 * @returns {HTMLElement} The card element
 */
Card.prototype.createElement = function(previewFrame) {
    const element = document.createElement("div");

    new CardBackground(
        element,
        this.WIDTH,
        this.HEIGHT,
        new Random(Random.prototype.makeSeed(this.body.age / 0xFFFF)));

    element.className = this.CLASS;
    element.appendChild(previewFrame);
    element.appendChild(this.createColors());
    element.appendChild(this.createInfo());
    element.appendChild(this.createDownload());

    return element;
};

/**
 * Release all resources maintained by the card
 */
Card.prototype.free = function() {
    if (this.previewURL)
        URL.revokeObjectURL(this.previewURL);

    this.initialized = false;
};