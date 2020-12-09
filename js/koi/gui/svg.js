/**
 * SVG element creation functions
 */
const SVG = {
    URI: "http://www.w3.org/2000/svg",
    /**
     * Create an SVG element
     * @param {Number} [width] The element width in pixels
     * @param {Number} [height] The element height in pixels
     * @returns {SVGSVGElement} An SVG element
     */
    createElement: function(width, height) {
        const element = document.createElementNS(SVG.URI, "svg");

        if (width !== undefined)
            element.setAttribute("width", width.toString());

        if (height !== undefined)
            element.setAttribute("height", height.toString());

        return element;
    }
};