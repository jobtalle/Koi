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
    // TODO: Disable while tutorials are active

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
 * Enter the drag area
 */
Drop.prototype.dragEnter = function() {
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

    for (const file of event.dataTransfer.files) {
        if (this.gui.cards.hand.isFull())
            break;

        this.dropFile(file, new Vector2(event.clientX, event.clientY));
    }

    this.dragLeave();
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
            const body = new CodeReader(image).read(this.systems.atlas, this.systems.randomSource);

            if (body) {
                body.initializeSpine(new Vector2(), new Vector2(1, 0));

                this.gui.cards.add(new Card(body, target, 0));
            }
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
};