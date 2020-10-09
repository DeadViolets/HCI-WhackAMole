// Elements
const beginningCircle = document.getElementById("beginningCircle");
const smallCircle = document.getElementById("smallCircle");
const mediumCircle = document.getElementById("mediumCircle");
const bigCircle = document.getElementById("bigCircle");
const gameWindow = document.getElementById("gameWindowDiv");
const pHits = document.getElementById("pHits");
const pMisses = document.getElementById("pMisses");

const calibrationSmallX = 700;
const calibrationSmallY = 600;
const calibrationMediumX = 5;
const calibrationMediumY = 100;
const calibrationBigX = 700;
const calibrationBigY = 250;

// Other constants
const width = gameWindow.offsetWidth
const height = gameWindow.offsetHeight
const idSmall = Math.log2((calcDistanceTo(calibrationSmallX + smallCircle.offsetWidth / 2, calibrationSmallY + smallCircle.offsetWidth / 2) / smallCircle.offsetWidth) + 1);
const idMedium = Math.log2((calcDistanceTo(calibrationMediumX + mediumCircle.offsetWidth / 2, calibrationMediumY + mediumCircle.offsetWidth / 2) / mediumCircle.offsetWidth) + 1);
const idBig = Math.log2((calcDistanceTo(calibrationBigX + bigCircle.offsetWidth / 2, calibrationBigY + bigCircle.offsetWidth / 2) / bigCircle.offsetWidth) + 1);

// Variables for the test
let testActive = false;
let calibrationActive = true;
let calibrationTestActive = false;
let calibrationTargetCount = 1;
let calibrationCount = 1 + 1; // One more than you want to do :)
let calibrationResults = [];
let misses = 0;
let hits = 0;
let aConstant = 0.2;
let bConstant = 0;
let tpMean = 0;
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
        calibrationTestActive = false;
        calibrationTargetCount++;
        if(calibrationTargetCount == 4) {
            calibrationTargetCount = 1;
        }
    }
}

function initCalibrationTargets() {
    switch(calibrationTargetCount) {
        case 1:
            bigCircle.style.display = "initial";
            bigCircle.style.position = "absolute";
            bigCircle.style.left = calibrationBigX + 'px';
            bigCircle.style.top = calibrationBigY + 'px';
            break;
        case 2:
            mediumCircle.style.display = "initial";
            mediumCircle.style.position = "absolute";
            mediumCircle.style.left = calibrationMediumX + 'px';
            mediumCircle.style.top = calibrationMediumY + 'px';
            break;
        case 3:
            smallCircle.style.display = "initial";
            smallCircle.style.position = "absolute";
            smallCircle.style.left = calibrationSmallX + 'px';
            smallCircle.style.top = calibrationSmallY + 'px';
            break;
    }
}

function beginCalibrationRound() {
    calibrationTimerStart = Date.now();
    initCalibrationTargets();
}

function calculateAndInterpretCalibrationResults() {
    let tpSum = 0;
    for(var i = 0; i < calibrationResults.length; i++) {
        let mod = (i + 1) % 3;
        if(mod == 1) {
            tpSum += idBig / calibrationResults[i];
        } else if (mod == 2) {
            tpSum += idMedium / calibrationResults[i];
        } else {
            tpSum += idSmall / calibrationResults[i];
        }
    }
    tpMean = tpSum / calibrationResults.length;
}

function calcDistanceTo(x, y) {
    let xx = x - (beginningCircle.offsetLeft + (beginningCircle.offsetWidth / 2));
    let yy = y - (beginningCircle.offsetTop + (beginningCircle.offsetWidth / 2));
    return Math.sqrt((xx * xx) + (yy * yy));
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
                    calculateAndInterpretCalibrationResults();
                    resetAllTargets();
                    return;
                }
            }
            beginCalibrationRound();
        }
    }
    else if (!testActive) {
        testActive = true;
        let tmpId = 0;
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
                tmpId = Math.log2((calcDistanceTo(xPlacement, yPlacement) / smallCircle.offsetWidth) + 1);
                break;
            case 2:
                mediumCircle.style.display = "initial";
                mediumCircle.style.position = "absolute";
                xPlacement = calculateCirclePlacement(mediumCircle.offsetWidth / 2, width);
                yPlacement = calculateCirclePlacement(mediumCircle.offsetWidth / 2, height);
                mediumCircle.style.left = xPlacement + 'px';
                mediumCircle.style.top = yPlacement + 'px';
                tmpId = Math.log2((calcDistanceTo(xPlacement, yPlacement) / mediumCircle.offsetWidth) + 1);
                break;
            case 3:
                bigCircle.style.display = "initial";
                bigCircle.style.position = "absolute";
                xPlacement = calculateCirclePlacement(bigCircle.offsetWidth / 2, width);
                yPlacement = calculateCirclePlacement(bigCircle.offsetWidth / 2, height);
                bigCircle.style.left = xPlacement + 'px';
                bigCircle.style.top = yPlacement + 'px';
                tmpId = Math.log2((calcDistanceTo(xPlacement, yPlacement) / bigCircle.offsetWidth) + 1);
                break;
        }
        //let timeout = Math.round(Math.random() * 3 + 2);
        let timeout = tmpId / tpMean;
        timeoutTracker = setTimeout(missedTarget, Math.round(timeout));
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