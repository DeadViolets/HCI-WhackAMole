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
let calibrationActive = true;
let calibrationTestActive = false;
let calibrationTargetCount = 1;
let calibrationCount = 3;
let calibrationResults = [];
let misses = 0;
let hits = 0;
var timeoutTracker;
var calibrationTimerStart;
var calibrationTimerEnd;

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
    let circleDiameter = circleRadius * 2;
    let placement = getRandomIntInRange(0, (maxEdge - (2 * circleDiameter)) - beginningCircle.offsetWidth);
    if ((placement + circleDiameter) > ((maxEdge / 2) - (beginningCircle.offsetWidth / 2)) - circleDiameter) { // Overlap beginningCircle
        placement += (beginningCircle.offsetWidth + circleDiameter); // Fix overlap
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
    if(calibrationActive) {
        calibrationTimerEnd = Date.now();
        let result = calibrationTimerEnd - calibrationTimerStart;
        calibrationResults.push(result);
    }
}

function initCalibrationTargets() {
    switch(calibrationTargetCount) {
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
    }
}

function beginCalibrationRound() {
    calibrationTimerStart = Date.now();
    initCalibrationTargets();
}

async function beginRound() {
    if (calibrationActive) {
        if(!calibrationTestActive) {
            calibrationTestActive = true;
            if(calibrationTargetCount == 1) {
                calibrationCount--;
                if(calibrationCount == 0) {
                    hits = 0;
                    pHits.innerHTML = "Hits: " + hits;
                    calibrationActive = false;
                }
                else {
                    beginCalibrationRound()
                }
            }
        }
    }
    else if (!testActive) {
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