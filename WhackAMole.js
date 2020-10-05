// Elements
const beginningCircle = document.getElementById("beginningCircle");
const smallCircle = document.getElementById("smallCircle");
const mediumCircle = document.getElementById("mediumCircle");
const bigCircle = document.getElementById("bigCircle");
const gameWindow = document.getElementById("gameWindowDiv");
const pHits = document.getElementById("pHits");
const pMisses = document.getElementById("pMisses");

// Window size
const width = gameWindow.offsetWidth
const height = gameWindow.offsetHeight

// Variables for the test
let testActive = false;
let misses = 0;
let hits = 0;
var timeoutTracker;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetAllTargets() {
    smallCircle.style.display = "none";
    mediumCircle.style.display = "none";
    bigCircle.style.display = "none";
}

function getRandomIntInRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let r = Math.floor(Math.random() * ((max - 1) + 1)) + min;
    return r
}

function calculateCirclePlacement(circleRadius, maxEdge) {
    let placement = getRandomIntInRange(circleRadius, maxEdge - ((circleRadius * 3) + beginningCircle.offsetWidth));
    if ((placement + circleRadius) > ((maxEdge / 2) + (beginningCircle.offsetWidth / 2) + circleRadius)) {
        placement += (beginningCircle.offsetWidth + (2 * circleRadius));
    }
    return placement;
}

function missedTarget() {
    misses++;
    pMisses.innerHTML = "Misses: " + misses;
    resetAllTargets();
    testActive = false;
}

function clickTarget() {
    clearTimeout(timeoutTracker);
    hits++;
    pHits.innerHTML = "Hits: " + hits;
    resetAllTargets();
    testActive = false;
}

async function beginRound() {
    if (!testActive) {
        testActive = true;
        let randomCircle = getRandomIntInRange(1, 3);
        let randomTimeToAppear = Math.round((Math.random() + 1) * 1000);
        await sleep(randomTimeToAppear);
        let xPlacement = 0;
        let yPlacement = 0;
        switch (randomCircle) {
            case 1:
                smallCircle.style.display = "initial";
                smallCircle.style.position = "absolute";
                xPlacement = calculateCirclePlacement(smallCircle.offsetWidth / 2, width);
                yPlacement = calculateCirclePlacement(smallCircle.offsetWidth / 2, height);
                smallCircle.style.left = xPlacement + 'px';
                smallCircle.style.top = yPlacement + 'px';
                break;
            case 2:
                mediumCircle.style.display = "initial";
                mediumCircle.style.position = "absolute";
                xPlacement = calculateCirclePlacement(mediumCircle.offsetWidth / 2, width);
                yPlacement = calculateCirclePlacement(mediumCircle.offsetWidth / 2, height);
                mediumCircle.style.left = xPlacement + 'px';
                mediumCircle.style.top = yPlacement + 'px';
                break;
            case 3:
                bigCircle.style.display = "initial";
                bigCircle.style.position = "absolute";
                xPlacement = calculateCirclePlacement(bigCircle.offsetWidth / 2, width);
                yPlacement = calculateCirclePlacement(bigCircle.offsetWidth / 2, height);
                bigCircle.style.left = xPlacement + 'px';
                bigCircle.style.top = yPlacement + 'px';
                break;
        }
        let timeout = Math.round(Math.random() * 3 + 2);
        timeoutTracker = setTimeout(missedTarget, timeout * 1000);
    }
}

function initGame() {
    beginningCircle.style.display = "inline"

    beginningCircle.onclick = beginRound;

    resetAllTargets();
    smallCircle.onclick = clickTarget;
    mediumCircle.onclick = clickTarget;
    bigCircle.onclick = clickTarget;
}

window.onload = initGame;

document.onkeydown = onKey;

function onKey(e) {
    if (e == null) {
        e = window.event;
    }
    switch (e.which || e.charCode || e.keyCode) {
        case 32:
            beginRound();
            break;
        case 65:
            // a
            if (experimentActive) {
                stopExperiment();
                saveToCsv();
            }
            break;
        case 66:
        // b
        // here you can extend... alert("pressed the b key"); break;
    }
}