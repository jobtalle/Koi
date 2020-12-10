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
        const element = document.createElementNS(SVG.URI, "svg");

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
        const element = document.createElementNS(SVG.URI, "pattern");

        element.id = id;
        element.setAttribute("width", "100%");
        element.setAttribute("height", "45");

        return element;
    },
    /**
     * Create a mask
     * @param {String} id The id for this mask
     * @returns {SVGMaskElement} The mask element
     */
    createMask: function(id) {
        const element = document.createElementNS(SVG.URI, "mask");

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
        element.setAttribute("viewBox", left + " " + top + " " + width + " " + height);
    },
    /**
     * Set the transform of an element
     * @param {SVGElement} element An SVG element
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Number} [angle] The angle in degrees
     */
    setTransform: function(element, x, y, angle) {
        let transform = "translate(" + x + " " + y + ")";

        if (angle !== undefined)
            transform += "rotate(" + angle + ")";

        element.setAttribute("transform", transform);
    },
    /**
     * Set the fill of an element
     * @param {SVGElement} element The element
     * @param {String} fill The fill
     */
    setFill: function(element, fill) {
        element.setAttribute("fill", fill);
    },
    /**
     * Create a group
     * @param [className] The class name for this group
     * @returns {SVGGElement} The group element
     */
    createGroup: function(className) {
        const element = document.createElementNS(SVG.URI, "g");

        if (className)
            element.setAttribute("class", className);

        return element;
    },
    /**
     * Create a path
     * @param {(Number|String)[]}commands An array of commands, which may be strings or numbers
     * @param {String} [className] The class name
     * @returns {SVGPathElement} The path element
     */
    createPath: function(commands, className) {
        const element = document.createElementNS(SVG.URI, "path");
        let pathString = "";

        for (const command of commands)
            if (typeof command === "number")
                pathString += command.toString() + " ";
            else
                pathString += command;

        element.setAttributeNS(null, "d", pathString);

        if (className)
            element.setAttribute("class", className);

        return element;
    },
    /**
     * Create a circle
     * @param {Number} x The X position
     * @param {Number} y The Y position
     * @param {Number} radius The radius
     * @param {String} [className] The class name
     * @returns {SVGCircleElement} The circle element
     */
    createCircle: function (x, y, radius, className) {
        const element = document.createElementNS(SVG.URI, "circle");

        element.setAttribute("cx", x.toString());
        element.setAttribute("cy", y.toString());
        element.setAttribute("r", radius.toString());

        if (className)
            element.setAttribute("class", className);

        return element;
    }
};