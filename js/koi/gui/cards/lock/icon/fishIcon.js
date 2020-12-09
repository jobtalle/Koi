/**
 * A fish icon
 * @param {FishIconLayer[]} [layers] Decoration layers for this fish icon
 * @constructor
 */
const FishIcon = function(layers = []) {
    this.element = SVG.createElement(this.WIDTH, this.HEIGHT);
};

FishIcon.prototype.CLASS = "fish-icon";
FishIcon.prototype.WIDTH = 100;
FishIcon.prototype.HEIGHT = 50;