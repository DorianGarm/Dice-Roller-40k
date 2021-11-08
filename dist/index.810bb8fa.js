// ------------------------ Selectors ------------------------
const rollHitBtn = document.getElementById("roll-hit");
const rollWndBtn = document.getElementById("roll-wnd");
const rollSaveBtn = document.getElementById("roll-save");
const inputAttacks = document.getElementById("attack-box");
const inputToHit = document.getElementById("to-hit-box");
const inputToWound = document.getElementById("to-wound-box");
const inputToSave = document.getElementById("to-save-box");
const succesfulHitBox = document.getElementById("successful-hits");
const succesfulWoundBox = document.getElementById("successful-wounds");
const failedSaveBox = document.getElementById("failed-saves");
const HitDice = document.querySelector(".hit-box");
const WoundDice = document.querySelector(".wound-box");
const SaveDice = document.querySelector(".save-box");
const rr1hBtn = document.getElementById("rr1-hit");
const rr1wBtn = document.getElementById("rr1-wnd");
const rrAhBtn = document.getElementById("rrA-hit");
const rrAwBtn = document.getElementById("rrA-wnd");
const avgHits = document.getElementById("average-hits");
const avgWounds = document.getElementById("average-wounds");
const avgSaves = document.getElementById("average-saves");
const fnp5Btn = document.getElementById("fnp5-btn");
const fnp6Btn = document.getElementById("fnp6-btn");
const fnpText = document.getElementById("fnp-text");
// ------------------------ Temporary data block ------------------------
let tempHitData, tempWoundData, tempSaveData, tempHitCount, tempWoundCount, tempSaveCount;
// ------------------------ Roll Functionality ------------------------
const roll = function(param) {
    expected();
    if (param === "Hit") {
        if (!inputToHit.value) return;
        tempHitData = roller(inputAttacks.value);
        updateUI(HitDice);
    }
    if (param === "Wound") {
        if (!inputToWound.value) return;
        tempWoundData = roller(tempHitCount[0]);
        updateUI(WoundDice);
    }
    if (param === "Save") {
        if (!inputToSave.value) return;
        tempSaveData = roller(tempWoundCount[0]);
        updateUI(SaveDice);
    }
};
const roller = function(num) {
    let data = [
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];
    for(let i = 1; i <= num; i++){
        let result = dice();
        let newData = data[result] + 1;
        data[result] = newData;
    }
    return data;
};
const dice = function() {
    return Math.floor(Math.random() * 6) + 1;
};
const updateUI = function(param) {
    if (param === HitDice) {
        data = tempHitData;
        tempHitCount = counter(tempHitData, inputToHit.value);
        succesfulHitBox.textContent = tempHitCount[0];
        avgText("Hits");
    }
    if (param === WoundDice) {
        data = tempWoundData;
        tempWoundCount = counter(tempWoundData, inputToWound.value);
        succesfulWoundBox.textContent = tempWoundCount[0];
        avgText("Wounds");
    }
    if (param === SaveDice) {
        data = tempSaveData;
        tempSaveCount = counter(tempSaveData, inputToSave.value);
        failedSaveBox.textContent = tempSaveCount[1];
        avgText("Saves");
    }
    param.innerHTML = `<p>
  ${data[1]}x <img src="img/dice-1.png" class="dice" /> ${data[2]}x
  <img src="img/dice-2.png" class="dice" /> ${data[3]}x
  <img src="img/dice-3.png" class="dice" />
  </p>
  <p>
  ${data[4]}x <img src="img/dice-4.png" class="dice" /> ${data[5]}x
  <img src="img/dice-5.png" class="dice" /> ${data[6]}x
  <img src="img/dice-6.png" class="dice" />
  </p>`;
};
const counter = function(data, threshold) {
    let successCount = data.slice(threshold);
    let failCount = data.slice(0, threshold);
    let sCount = 0;
    let fCount = 0;
    for(let i = 0; i < successCount.length; i++)sCount += successCount[i];
    for(let i1 = 0; i1 < failCount.length; i1++)fCount += failCount[i1];
    return [
        sCount,
        fCount
    ];
};
const avgText = function(param) {
    const data = expected();
    if (param === "Hits") {
        const differnce = tempHitCount[0] - data[0];
        differnceText(differnce, avgHits);
    }
    if (param === "Wounds") {
        const differnce = tempWoundCount[0] - data[1];
        differnceText(differnce, avgWounds);
    }
    if (param === "Saves") {
        const differnce = -1 * (data[2] - tempSaveCount[1]);
        differnceText(differnce, avgSaves);
    }
};
const expected = function() {
    const expectedHits = Math.round(inputAttacks.value * (6 - inputToHit.value + 1) / 6);
    const expectedWounds = Math.round(expectedHits * (6 - inputToWound.value + 1) / 6);
    const expectedSaves = Math.round(expectedWounds * (6 - inputToSave.value + 1) / 6);
    const expectedFailedSaves = Math.round(expectedWounds - expectedSaves);
    return [
        expectedHits,
        expectedWounds,
        expectedFailedSaves
    ];
};
const differnceText = function(param, type) {
    if (Math.sign(param) === 1) type.textContent = `${Math.abs(param)} above average`;
    if (Math.sign(param) === 0) type.textContent = `average`;
    if (Math.sign(param) === -1) type.textContent = `${Math.abs(param)} below average`;
};
// ------------------------ Re-Roll 1s functionality ------------------------
const reRoll1 = function(param) {
    if (param === "Hit") {
        newRolls = roller(tempHitData[1]);
        tempHitData[1] = 0;
        tempHitData = tempHitData.SumArray(newRolls);
        updateUI(HitDice);
    }
    if (param === "Wound") {
        const ones = tempWoundData[1];
        tempWoundData[1] = 0;
        rolls = roller(ones);
        tempWoundData = tempWoundData.SumArray(rolls);
        updateUI(WoundDice);
    }
// Reroll 1s to save functionality, if needed:
// if (param === "Save") {
//   const ones = tempSaveData[1];
//   tempSaveData[1] = 0;
//   rolls = roller(ones);
//   tempSaveData = tempSaveData.SumArray(rolls);
//   updateUI(SaveDice);
// }
};
Array.prototype.SumArray = function(arr) {
    var sum = this.map(function(num, idx) {
        return num + arr[idx];
    });
    return sum;
};
// ------------------------ Re-Roll all fails functionality ------------------------
const reRollA = function(param) {
    if (param === "Hit") {
        newRolls = roller(tempHitCount[1]);
        tempHitCount[1] = 0;
        dataCleanUp(inputToHit, tempHitData);
        tempHitData = tempHitData.SumArray(newRolls);
        updateUI(HitDice);
    }
    if (param === "Wound") {
        newRolls = roller(tempWoundCount[1]);
        tempWoundCount[1] = 0;
        dataCleanUp(inputToWound, tempWoundData);
        tempWoundData = tempWoundData.SumArray(newRolls);
        updateUI(WoundDice);
    }
// Reroll all to save functionality, if needed:
// if (param === "Save") {
//   newRolls = roller(tempSaveCount[1]);
//   tempSaveCount[1] = 0;
//   dataCleanUp(inputToSave, tempSaveData);
//   tempSaveData = tempSaveData.SumArray(newRolls);
//   updateUI(SaveDice);
// }
};
const dataCleanUp = function(num, data) {
    for(let i = 0; i < num.value; i++)data[i] = 0;
};
// ------------------------ 5+++ FNP functionality ------------------------
const FNP = function(val) {
    const tempFNPData = roller(tempSaveCount[1]);
    console.log("FNP rolls:" + tempFNPData);
    const tempFNPCount = counter(tempFNPData, val);
    fnpText.textContent = `${tempFNPCount[1]} DMG goes through`;
};
// ------------------------ Event handlers ------------------------
rollHitBtn.addEventListener("click", function() {
    roll("Hit");
});
rollWndBtn.addEventListener("click", function() {
    roll("Wound");
});
rollSaveBtn.addEventListener("click", function() {
    roll("Save");
});
rr1hBtn.addEventListener("click", function() {
    reRoll1("Hit");
});
rr1wBtn.addEventListener("click", function() {
    reRoll1("Wound");
});
fnp5Btn.addEventListener("click", function() {
    FNP(5);
});
fnp6Btn.addEventListener("click", function() {
    FNP(6);
});
rrAhBtn.addEventListener("click", function() {
    reRollA("Hit");
});
rrAwBtn.addEventListener("click", function() {
    reRollA("Wound");
});
// ------------------------ Modal button functionality ------------------------
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnOpenModal = document.getElementById("help");
btnOpenModal.addEventListener("click", clickHandlerOpen);
overlay.addEventListener("click", clickHandlerClose);
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) clickHandlerClose();
});
function clickHandlerOpen() {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}
function clickHandlerClose() {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
}

//# sourceMappingURL=index.810bb8fa.js.map
