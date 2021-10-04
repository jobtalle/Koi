{
    const head = document.getElementsByTagName("head")[0];

    /**
     * Override existing CSS
     * @param {HTMLHeadElement} head The document head
     * @param {string} file A path to a CSS file
     */
    const overrideCSS = (head, file) => {
        const link = document.createElement("link");

        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = file;
        link.media = "all";

        head.appendChild(link);
    };

    // overrideCSS(head, "css/colors/autumn.css");
}