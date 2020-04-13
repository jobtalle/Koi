{
    const atlas = new Image();

    atlas.onload = () => {
        const TIME_STEP_MAX = 1;
        const renderer = new Renderer(document.getElementById("renderer"), atlas);
        const koi = new Koi(renderer);

        const resize = () => {
            const canvas = document.getElementById("renderer");
            const wrapper = document.getElementById("wrapper");

            canvas.width = wrapper.offsetWidth;
            canvas.height = wrapper.offsetHeight;

            renderer.resize(canvas.width, canvas.height);
        };

        window.onresize = resize;

        resize();

        let lastDate = new Date();

        const loop = () => {
            const date = new Date();

            koi.update(Math.min((date - lastDate) * .001, TIME_STEP_MAX));
            koi.render();

            lastDate = date;

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    };

    atlas.src = "atlas.png";
}