const MAX_CELL = 24;
const MAX_HISTORY = 3;
const STEP_TIME = 5000;
const START_LAG = 1000;
const CLEAR_LAG = 2000;

document.addEventListener('DOMContentLoaded', (event) => {
  if (location.search.includes("blackout") || location.search.includes("greyout")) {
    let elems = document.getElementById("grid").getElementsByTagName("div");
    let colour = location.search.includes("blackout") ? "#000" : "#aaa";
    for (const elem of elems) {
      elem.style.backgroundColor = colour;
    }
  }
  let start_lag = START_LAG;
  let clear_lag = CLEAR_LAG;
  let step_time = STEP_TIME;
  if (location.search.includes("fast1")) {
    start_lag /= 2;
    clear_lag /= 2;
    step_time /= 2;
  } else if (location.search.includes("fast2")) {
    start_lag /= 3;
    clear_lag /= 3;
    step_time /= 3;
  } else if (location.search.includes("fast3")) {
    start_lag /= 4;
    clear_lag /= 4;
    step_time /= 4;
  }
  setTimeout(updateGridColors, start_lag, [], clear_lag, step_time);
});

/**
 *
 * @param {*} previous
 */
function updateGridColors(previous, clear_lag, step_time) {
    previous = previous || [];
    let i = getRandomCellId(previous);
    let colorNum = getRandomColorNum(previous);
    let color = numToColor(colorNum);

    setCellColor("cell-" + i, color);
    previous.push([i, colorNum]);
    if (previous.length > MAX_HISTORY) {
        setTimeout(setCellColor, clear_lag, "cell-" + previous.shift()[0], "#000000");
    }
    setTimeout(updateGridColors, step_time, previous, clear_lag, step_time);
}

function getRandomCellId(previous) {
    let previousIds = previous.map(([i, _]) => i);
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
