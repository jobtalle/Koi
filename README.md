# Koi Farm
A Koi breeding game. Get it [on steam](https://store.steampowered.com/app/1518810/Koi_Farm) or [on itch.io](https://jobtalle.itch.io/koifarm).

## Building
HTML, CSS and Javascript content is compressed using [squish.py](https://github.com/jobtalle/squish.py), which is included in this repository as a submodule. Before building, ensure that this library has been cloned as well.

Make sure [node.js](https://www.nodejs.org) and [python 3](https://www.python.org/) are installed. After calling `npm i` to install all required packages, the following commands can be used to create binaries using `electron-packager`:

| Operating system | Command |
| --- | ---- |
| Windows (32 bit) | `npm run build-win-32` |
| Windows (64 bit) | `npm run build-win-64` |

Additionally, `npm run compress` can be called to compress HTML, CSS and Javscript content without building binaries. The compressed HTML file `release.html` will be created in the project root.