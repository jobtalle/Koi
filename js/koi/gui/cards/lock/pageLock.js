/**
 * A lock for a card page
 * @param {PageLockRequirement[]} requirements The requirements to unlock this lock
 * @constructor
 */
const PageLock = function(requirements) {
    this.requirements = requirements;
    this.element = this.createElement();
    this.locked = true;
};

PageLock.prototype.CLASS = "page-lock";
PageLock.prototype.CLASS_REQUIREMENT_LIST = "requirements";

/**
 * Unlock this lock
 */
PageLock.prototype.unlock = function() {
    this.locked = false;
    this.element.parentElement.removeChild(this.element);
};

/**
 * Create the list of requirements
 */
PageLock.prototype.createRequirementList = function() {
    const element = document.createElement("div");

    element.className = this.CLASS_REQUIREMENT_LIST;

    for (const requirement of this.requirements)
        element.appendChild(requirement.element);

    return element;
};

/**
 * Create the page lock element
 * @returns {HTMLDivElement} The element
 */
PageLock.prototype.createElement = function() {
    const element = document.createElement("div");

    element.className = this.CLASS;
    element.appendChild(this.createRequirementList());

    return element;
};