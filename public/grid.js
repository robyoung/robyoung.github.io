const MAX_CELL = 24;
const MAX_HISTORY = 3;
const STEP_TIME = 5000;
const START_LAG = 1000;
const CLEAR_LAG = 2000;

document.addEventListener('DOMContentLoaded', (event) => {
  if (location.search.includes("blackout")) {
    let grid = document.getElementById("grid");
    let elems = grid.getElementsByTagName("div");
    for (const elem of elems) {
      elem.style.backgroundColor = "#000";
    }
  }
  setTimeout(updateGridColors, START_LAG);
});

/**
 *
 * @param {*} previous
 */
function updateGridColors(previous) {
    previous = previous || [];
    let i = getRandomCellId(previous);
    let colorNum = getRandomColorNum(previous);
    let color = numToColor(colorNum);

    setCellColor("cell-" + i, color);
    previous.push([i, colorNum]);
    if (previous.length > MAX_HISTORY) {
        setTimeout(setCellColor, CLEAR_LAG, "cell-" + previous.shift()[0], "#000000");
    }
    setTimeout(updateGridColors, STEP_TIME, previous);
}

function getRandomCellId(previous) {
    let previousIds = previous.map(([i, color]) => i);
    while (true) {
        let i = Math.floor(Math.random() * (MAX_CELL + 1));
        if (!previousIds.includes(i)) {
            return i;
        }
    }
}

function getRandomColorNum(previous) {
    while (true) {
        let num = Math.floor(Math.random() * 26);
        if (previous.filter(([_, prev]) => Math.abs(num - prev) < 3).length == 0) {
            return num;
        }
    }
}

/**
 * Convert a number into an RGB colour string.
 * Taken from https://krazydad.com/tutorials/makecolors.php
 *
 * @param {int} num the number to generate a color for
 * @returns RGB colour string
 */
function numToColor(num) {
    let frequency = 0.3;
    let red = Math.sin(frequency * num + 0) * 127 +128;
    let green = Math.sin(frequency * num + 2) * 127 + 128;
    let blue = Math.sin(frequency * num + 4) * 127 + 128;

    return RGB2Color(red, green, blue);
}

/**
 * From https://krazydad.com/tutorials/makecolors.php
 *
 * @param {int} r red value
 * @param {int} g green value
 * @param {int} b blue value
 * @returns RGB colour string
 */
function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

/**
 * From https://krazydad.com/tutorials/makecolors.php
 *
 * @param {int} n a number between 0 and 255 inclusive
 * @returns hex string for the number
 */
function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

/**
 *
 * @param {string} cellId the CSS ID of the cell to set the color on
 * @param {string} color the CSS color code to set the background to
 */
function setCellColor(cellId, color) {
    let cell = document.getElementById(cellId);
    cell.style.backgroundColor = color;
}
