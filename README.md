# Koi Farm
A Koi breeding game. Get it [on steam](https://store.steampowered.com/app/1518810/Koi_Farm) or [on itch.io](https://jobtalle.itch.io/koifarm).

Koi Farm has been licensed under the [CC-BY-NC-SA](LICENSE.md) license.

## Building
HTML, CSS and Javascript content is compressed using [squish.py](https://github.com/jobtalle/squish.py), which is included in this repository as a submodule. Before building, ensure that this library has been cloned as well.

Make sure [node.js](https://www.nodejs.org) and [python 3](https://www.python.org/) are installed. After calling `npm i` to install all required packages, the following commands can be used to create binaries using [electron](https://github.com/electron/electron):

| Operating system | Command |
| --- | ---- |
| Windows (32 bit) | `npm run build-win-32` |
| Windows (64 bit) | `npm run build-win-64` |
| Linux (64 bit) | `npm run build-linux-64` |
| Mac (64 bit) | `npm run build-mac-64` |

Additionally, `npm run compress` can be called to compress HTML, CSS and Javscript content without building binaries. The compressed HTML file `release.html` will be created in the project root. The file requires the `audio`, `font`, `svg` and `language` directories to run, as well as `favicon.ico` and `manifest.json`.

Concept & promotional art by [Samma van Klaarbergen](https://www.artstation.com/samma).

Logo by [@rosebolt](https://www.instagram.com/rosebolt/).

Polish translations by Jakub Niklas.

Turkish translations by Çağla Spellar.

French translations by [@LikanaWolf](https://twitter.com/LikanaWolf).

Japanese translations by [@RobinZanden](https://twitter.com/RobinZanden).

German translations by [@kaera_art](https://www.instagram.com/kaera_art/).