{
    const atlas = new Image();

    atlas.onload = () => {
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

            koi.update((date - lastDate) * .001);
            koi.render();

            lastDate = date;

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    };

    atlas.src = "atlas.png";
}