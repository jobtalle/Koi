/**
 * A sprite
 * @param {String} name The sprite name
 * @param {Vector} origin The sprite origin, either as a factor or in pixels
 * @constructor
 */
const Sprite = function(name, origin = this.ORIGIN_DEFAULT) {
    this.name = name;
    this.origin = origin;
    this.frame = 0;
    this.frameTime = 0;

    if (this.origin.x > 1 || this.origin.y > 1) {
        this.origin.x /= this.getWidth();
        this.origin.y /= this.getHeight();
    }
};

Sprite.prototype.ORIGIN_DEFAULT = new Vector();

/**
 * Update the sprite animation
 * @param {Number} timeStep The elapsed time in seconds
 */
Sprite.prototype.update = function(timeStep) {
    this.frameTime += timeStep;

    while (this.frameTime > sprites[this.name].frames[this.frame].t) {
        this.frameTime -= sprites[this.name].frames[this.frame].t;

        if (++this.frame === sprites[this.name].frames.length)
            this.frame = 0;
    }
};

/**
 * Set the frame
 * @param {Number} index A frame index
 */
Sprite.prototype.setFrame = function(index) {
    this.frame = index;
    this.frameTime = 0;
};

/**
 * Get the sprite width
 * @returns {Number} The sprite width in pixels
 */
Sprite.prototype.getWidth = function() {
    return sprites[this.name].w;
};

/**
 * Get the sprite height
 * @returns {Number} The sprite height in pixels
 */
Sprite.prototype.getHeight = function() {
    return sprites[this.name].h;
};