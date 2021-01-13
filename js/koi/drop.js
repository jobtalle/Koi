/**
 * The drop target
 * @param {GUI} gui The GUI
 * @param {HTMLElement} element The visual drop target element
 * @param {HTMLElement} targetElement The element to listen to drop events on
 * @constructor
 */
const Drop = function(gui, element, targetElement) {
    this.gui = gui;
    this.element = element;
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
 * @param event
 */
Drop.prototype.drop = function(event) {
    event.preventDefault();

    for (const file of event.dataTransfer.files) {
        if (this.gui.cards.hand.isFull())
            break;

        this.dropFile(file);
    }

    this.dragLeave();
};

/**
 * Process a dropped file, turn it into a card if possible
 * @param {File} file A file
 */
Drop.prototype.dropFile = function(file) {
    if (!this.IMAGE_TYPES.includes(file.type))
        return;

    const reader = new FileReader();

    reader.onload = event => {
        const image = new Image();

        image.onload = () => {
            new CodeReader(image);
        };

        image.src = event.target.result;
    };

    reader.readAsDataURL(file);
};