/**
 * The drop target
 * @param {GUI} gui The GUI
 * @param {Systems} systems The systems
 * @param {HTMLElement} element The visual drop target element
 * @param {HTMLElement} targetElement The element to listen to drop events on
 * @constructor
 */
const Drop = function(gui, systems, element, targetElement) {
    this.gui = gui;
    this.element = element;
    this.systems = systems;

    targetElement.addEventListener("dragenter", this.dragEnter.bind(this));
    targetElement.addEventListener("dragleave", this.dragLeave.bind(this));
    targetElement.addEventListener("dragover", event => {
        event.preventDefault();

        return false;
    });
    targetElement.addEventListener("drop", this.drop.bind(this));
};

Drop.prototype.CLASS_POSSIBLE = "possible";
Drop.prototype.IMAGE_TYPES = ["image/jpeg", "image/png"];

/**
 * Check whether dropping is possible
 * @returns {Boolean} True if a target can be dropped
 */
Drop.prototype.canDrop = function() {
    return this.gui.cards.koi && !this.gui.cards.koi.tutorial
};

/**
 * Enter the drag area
 */
Drop.prototype.dragEnter = function() {
    if (this.canDrop())
        this.element.classList.add(this.CLASS_POSSIBLE);
};

/**
 * Leave the drag area
 */
Drop.prototype.dragLeave = function() {
    this.element.classList.remove(this.CLASS_POSSIBLE);
};

/**
 * Drop something
 * @param {Object} event The drop event
 */
Drop.prototype.drop = function(event) {
    event.preventDefault();

    this.dragLeave();

    if (this.canDrop()) {
        for (const file of event.dataTransfer.files) {
            if (this.gui.cards.hand.isFull())
                break;

            this.dropFile(file, new Vector2(event.clientX, event.clientY));
        }
    }
};

/**
 * Process a dropped file, turn it into a card if possible
 * @param {File} file A file
 * @param {Vector2} target The position the file was dropped at
 */
Drop.prototype.dropFile = function(file, target) {
    if (!this.IMAGE_TYPES.includes(file.type))
        return;

    const reader = new FileReader();

    reader.onload = event => {
        const image = new Image();

        image.onload = () => {
            if (!this.gui.cards.hand.isFull()) {
                const body = new CodeReader(image).read();

                if (body) {
                    const buffer = new BinBuffer();

                    body.pattern.serialize(buffer);
                    body.initializeSpine(new Vector2(), new Vector2(1, 0));

                    const card = new Card(body, target, 0);

                    card.initialize(
                        this.systems.preview,
                        this.systems.atlas,
                        this.systems.bodies,
                        this.systems.randomSource);

                    this.gui.cards.add(card);
                }
            }
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
};