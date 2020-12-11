/**
 * SVG element creation functions
 */
const SVG = {
    URI: document.getElementsByTagName("svg")[0].getAttribute("xmlns"),
    DEFS: document.getElementsByTagName("defs")[0],
    /**
     * Create an SVG element
     * @param {String} [className] The class name
     * @returns {SVGSVGElement} An SVG element
     */
    createElement: function(className) {
        const element = document.createElementNS(this.URI, "svg");

        if (className)
            element.setAttribute("class", className);

        return element;
    },
    /**
     * Create a pattern element
     * @param {String} id The id for this pattern
     * @returns {SVGPatternElement} The pattern element
     */
    createPattern: function(id) {
        const element = document.createElementNS(this.URI, "pattern");

        element.id = id;
        element.setAttribute("width", "100%");
        element.setAttribute("height", "100%");

        return element;
    },
    /**
     * Create a mask
     * @param {String} id The id for this mask
     * @returns {SVGMaskElement} The mask element
     */
    createMask: function(id) {
        const element = document.createElementNS(this.URI, "mask");

        element.id = id;

        return element;
    },
    /**
     * Set the mask for an SVG element
     * @param {SVGElement} element The SVG element
     * @param {String} id The ID name of the mask
     */
    setMask: function(element, id) {
        element.setAttribute("mask", "url(#" + id + ")");
    },
    /**
     * Set the view box of an existing SVG element
     * @param {SVGSVGElement} element An SVG element
     * @param {Number} left The left position of the view box
     * @param {Number} top The top position of the view box
     * @param {Number} width The width of the view box
     * @param {Number} height The height of the view box
     */
    setViewBox: function(element, left, top, width, height) {
        element.setAttribute("viewBox",
            left.toString() + " " +
            top.toString() + " " +
            width.toString() + " " +
            height.toString());
    },
    /**
     * Set the transform of an element
     * @param {SVGElement} element An SVG element
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Number} [angle] The angle in degrees
     */
    setTransform: function(element, x, y, angle) {
        let transform = "translate(" + x.toString() + " " + y.toString() + ")";

        if (angle !== undefined)
            transform += "rotate(" + angle.toString() + ")";

        element.setAttribute("transform", transform);
    },
    /**
     * Set the fill of an element
     * @param {SVGElement} element The element
     * @param {String} fill The fill ID
     */
    setFill: function(element, fill) {
        element.setAttribute("fill", fill);
    },
    /**
     * Set the pattern of an element
     * @param {SVGElement} element The element
     * @param {String} pattern The pattern ID
     */
    setPattern: function(element, pattern) {
        element.setAttribute("fill", "url(#" + pattern + ")");
    },
    /**
     * Set the ID of a SVG element
     * @param {SVGElement} element The SVG element
     * @param {String} id The ID
     */
    setId: function(element, id) {
        element.setAttribute("id", id);
    },
    /**
     * Create a group
     * @param [className] The class name for this group
     * @returns {SVGGElement} The group element
     */
    createGroup: function(className) {
        const element = document.createElementNS(this.URI, "g");

        if (className)
            element.setAttribute("class", className);

        return element;
    },
    /**
     * Create a path
     * @param {(Number|String)[]}commands An array of commands, which may be strings or numbers
     * @returns {SVGPathElement} The path element
     */
    createPath: function(commands) {
        const element = document.createElementNS(this.URI, "path");
        let pathString = "";

        for (const command of commands)
            if (typeof command === "number")
                pathString += command.toString() + " ";
            else
                pathString += command;

        element.setAttributeNS(null, "d", pathString);

        return element;
    },
    /**
     * Create a circle
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Number} radius The radius
     * @returns {SVGCircleElement} The circle element
     */
    createCircle: function (x, y, radius) {
        const element = document.createElementNS(this.URI, "circle");

        element.setAttribute("cx", x.toString());
        element.setAttribute("cy", y.toString());
        element.setAttribute("r", radius.toString());

        return element;
    },
    /**
     * Create a rectangle
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Number} width The width
     * @param {Number} height The height
     * @returns {SVGRectElement} The rectangle
     */
    createRect: function(x, y, width, height) {
        const element = document.createElementNS(this.URI, "rect");

        element.setAttribute("x", x.toString());
        element.setAttribute("y", y.toString());
        element.setAttribute("width", width.toString());
        element.setAttribute("height", height.toString());

        return element;
    }
};