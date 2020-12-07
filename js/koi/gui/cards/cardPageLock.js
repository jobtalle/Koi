/**
 * A lock for a card page
 * @constructor
 */
const CardPageLock = function() {
    this.locked = true;
};

/**
 * Unlock this lock
 */
CardPageLock.prototype.unlock = function() {
    this.locked = false;
};