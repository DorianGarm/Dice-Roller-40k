import {rollHitBtn, rollWndBtn, rollSaveBtn, rr1hBtn, rr1wBtn, fnp5Btn, fnp6Btn, rrAhBtn, rrAwBtn} from './selectors';
import {DICES, FNP, reRoll1, reRollA, roll} from "./diceRoller";


// ------------------------ Event handlers ------------------------
/*
Używaj jak najmniej hardcoded strings, jeśli będziesz coś zmieniał, to będziesz musiał latać po całej aplikacji
Podpinanie event handlerów możesz faktycznie przenieść do innego pliku
*/

const CLICK = 'click';

rollHitBtn.addEventListener(CLICK, function () {
    roll(DICES.Hit);
});
rollWndBtn.addEventListener(CLICK, function () {
    roll(DICES.Wound);
});
rollSaveBtn.addEventListener(CLICK, function () {
    roll(DICES.Save);
});
rr1hBtn.addEventListener(CLICK, function () {
    reRoll1(DICES.Hit);
});
rr1wBtn.addEventListener(CLICK, function () {
    reRoll1(DICES.Wound);
});
fnp5Btn.addEventListener(CLICK, function () {
    FNP(5);
});
fnp6Btn.addEventListener(CLICK, function () {
    FNP(6);
});
rrAhBtn.addEventListener(CLICK, function () {
    reRollA(DICES.Hit);
});
rrAwBtn.addEventListener(CLICK, function () {
    reRollA(DICES.Wound);
});

// ------------------------ Modal button functionality ------------------------

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnOpenModal = document.getElementById("help");

btnOpenModal.addEventListener(CLICK, clickHandlerOpen);
overlay.addEventListener(CLICK, clickHandlerClose);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        clickHandlerClose();
    }
});

function clickHandlerOpen() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function clickHandlerClose() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}
