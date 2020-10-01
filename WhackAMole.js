let width = "1024px";
let height = "768px";

let blueBox = document.getElementById("targetDiv");
//blueBox.style.left = wdith;

function changePosition() {
    blueBox.style.background = "green";
}

window.onload = changePosition;

document.onkeydown = onKey;

function onKey(e) {
    if(e == null) {
        e = window.event;
    }
    switch (e.which || e.charCode || e.keyCode) {
        case 32:
            changePosition();
            console.log(10);
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