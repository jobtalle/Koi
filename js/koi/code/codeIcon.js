/**
 * An icon for making fish codes
 * @param {HTMLElement} element The element to build the icon in
 * @constructor
 */
const CodeIcon = function(element) {
    element.appendChild(this.createIcon());
};

CodeIcon.prototype = Object.create(CodeIconConstants.prototype);

/**
 * Create the icon
 */
CodeIcon.prototype.createIcon = function() {
    const icon = SVG.createElement();
    const circle = SVG.createCircle(this.RADIUS, this.RADIUS, this.RADIUS);

    SVG.setViewBox(icon, 0, 0, this.RADIUS * 2, this.RADIUS * 2);
    SVG.setPattern(circle, this.ID);

    icon.appendChild(circle);

    return icon;
};