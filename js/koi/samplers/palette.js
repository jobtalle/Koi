/**
 * The palette containing all fish colors
 */
const Palette = {};

Palette.INDEX_WHITE = 0;
Palette.INDEX_BLACK = 1;
Palette.INDEX_GOLD = 2;
Palette.INDEX_ORANGE = 3;
Palette.INDEX_RED = 4;
Palette.INDEX_BROWN = 5;
Palette.INDEX_PURPLE = 6;
Palette.INDEX_BLUE = 7;
Palette.INDEX_PINK = 8;
Palette.INDEX_DARKBLUE = 9;
Palette.INDEX_LIGHTPURPLE = 10;
Palette.INDEX_TEAL = 11;
Palette.INDEX_GREEN = 12;
Palette.INDEX_DARKGREEN = 13;
Palette.INDEX_LIGHTBROWN = 14;
Palette.INDEX_LAST = Palette.INDEX_LIGHTBROWN;
Palette.COLOR_NAMES = [
    "white",
    "black",
    "gold",
    "orange",
    "red",
    "brown",
    "purple",
    "blue",
    "pink",
    "darkblue",
    "lightpurple",
    "teal",
    "green",
    "darkgreen",
    "lightbrown"
];
Palette.COLORS = [
    Color.fromCSS("--color-fish-white"),
    Color.fromCSS("--color-fish-black"),
    Color.fromCSS("--color-fish-gold"),
    Color.fromCSS("--color-fish-orange"),
    Color.fromCSS("--color-fish-red"),
    Color.fromCSS("--color-fish-brown"),
    Color.fromCSS("--color-fish-purple"),
    Color.fromCSS("--color-fish-blue"),
    Color.fromCSS("--color-fish-pink"),
    Color.fromCSS("--color-fish-darkblue"),
    Color.fromCSS("--color-fish-lightpurple"),
    Color.fromCSS("--color-fish-teal"),
    Color.fromCSS("--color-fish-green"),
    Color.fromCSS("--color-fish-darkgreen"),
    Color.fromCSS("--color-fish-lightbrown")
];