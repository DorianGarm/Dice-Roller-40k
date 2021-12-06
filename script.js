import * as _ from 'lodash';

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

// Te funkcje nie zależą od stanu aplikacji, można je spokojnie przenieść do innego pliku
function dice() {
  return Math.floor(Math.random() * 6) + 1;
}

function roller(num) {
  let data = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 1; i <= num; i++) {
    let result = dice();
    let newData = data[result] + 1;
    data[result] = newData;
  }

  return data;
}

function counter(data, threshold) {
  let successCount = data.slice(threshold);
  let failCount = data.slice(0, threshold);
  let sCount = 0;
  let fCount = 0;
  for (let i = 0; i < successCount.length; i++) {
    sCount += successCount[i];
  }
  for (let i = 0; i < failCount.length; i++) {
    fCount += failCount[i];
  }
  return [sCount, fCount];
}

// -------------------------------------

class DiceStats {
  constructor(uiInputElement, uiOutputElement, rollerValue = () => 0) {
    this.data = new Array(6).fill(0);
    this.count = new Array(6).fill(0);
    this.rollerValue = rollerValue;
    this.uiInputElement = uiInputElement;
    this.uiOutputElement = uiOutputElement;
  }

  roll() {
    if (this.uiInputElement.value) {

      this.data = roller(this.rollerValue());
      this.count = counter(this.data, this.uiInputElement.value);

      return true;
    }

    return false;
  }
}

// ------------------------ Temporary data block ------------------------

const DICES = {
 Hit: 'Hit',
 Wound: 'Wound',
 Save: 'Save'
};

/* Dodatkowy trick, żeby nie dało się zmodyfikować tego obiektu podczas wykonania programu */
Object.freeze(DICES);

/* Nie wiem czy znasz już arrow function syntax? '() => cos' */
const DICES_STATS = {
  [DICES.Hit]: new DiceStats(inputToHit, HitDice, () => inputAttacks.value),
  [DICES.Wound]: new DiceStats(inputToWound, WoundDice, () => DICES_STATS['Hit'].count[0]),
  [DICES.Save]: new DiceStats(inputToSave, SaveDice, () => DICES_STATS['Wound'].count[0])
};

// ------------------------ Roll Functionality ------------------------

function roll(param) {
  /*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  --expected()--
  Nie wiem czy dobrze rozumiem, ale ten call do 'expected' chyba nie jest potrzebny,
  bo expected chyba nie modyfikuje stanu aplikacji */

  const diceStats = DICES_STATS[param]

  if (diceStats.roll()) {
    updateUI(param, diceStats)
  }
}


function updateUI(param, diceStats) {
  const data = diceStats.data;
  const count = diceStats.count;
  const expect = expected();

  switch (param) {
    case DICES.Hit: {
      succesfulHitBox.textContent = count[0];
      differnceText(count[0] - expect[0], avgHits);
      break;
    }
    case DICES.Wound: {
      succesfulWoundBox.textContent = diceStats.count[0];
      differnceText(count[0] - expect[1], avgWounds);
      break;
    }
    case DICES.Save: {
      failedSaveBox.textContent = diceStats.count[1];
      differnceText( -(expect[2] - count[1]), avgSaves);
      break;
    }
  }

  diceStats.uiOutputElement.innerHTML = `<p>
    ${data[1]}x <img src="img/dice-1.png" class="dice" /> ${data[2]}x
    <img src="img/dice-2.png" class="dice" /> ${data[3]}x
    <img src="img/dice-3.png" class="dice" />
    </p>
    <p>
    ${data[4]}x <img src="img/dice-4.png" class="dice" /> ${data[5]}x
    <img src="img/dice-5.png" class="dice" /> ${data[6]}x
    <img src="img/dice-6.png" class="dice" />
    </p>`;
}

const expected = function () {
  const expectedHits = Math.round(
    (inputAttacks.value * (6 - inputToHit.value + 1)) / 6
  );
  const expectedWounds = Math.round(
    (expectedHits * (6 - inputToWound.value + 1)) / 6
  );
  const expectedSaves = Math.round(
    (expectedWounds * (6 - inputToSave.value + 1)) / 6
  );
  const expectedFailedSaves = Math.round(expectedWounds - expectedSaves);
  return [expectedHits, expectedWounds, expectedFailedSaves];
};

const differnceText = function (param, type) {
  if (Math.sign(param) === 1) {
    type.textContent = `${Math.abs(param)} above average`;
  }
  if (Math.sign(param) === 0) {
    type.textContent = `average`;
  }
  if (Math.sign(param) === -1) {
    type.textContent = `${Math.abs(param)} below average`;
  }
};

// ------------------------ Re-Roll 1s functionality ------------------------

const reRoll1 = function (param) {
  const diceStats = DICES_STATS[param];
  const { data } = diceStats;
  const newRolls = roller(data[1]);

  data[1] = 0;
  diceStats.data = sumArray2(data, newRolls);

  updateUI(param, diceStats);
};

/*
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Tak się raczej już nie robi, bo zmieniasz prototyp klasy Array dla całej aplikacji.
Jakbyś zrobił oddzielną metodę SumArray(arr1, arr2) to byłoby równie dobre.
Jeśli modyfikowałoby to w jakiś sposób `this` np. `this[0] = 666`, to miałoby jeszcze jakiś sens.
Jest dużo metod, którymi możesz osiągnąć ten sam efekt
 */
// Array.prototype.SumArray = function (arr) {
//   var sum = this.map(function (num, idx) {
//     return num + arr[idx];
//   });
//   return sum;
// };
/*
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Jest dużo metod, którymi możesz osiągnąć ten sam efekt,
dla przykładu
 */

function sumArray(arr1, arr2) {
  let sum = 0;

  //Dodatkowo sprawdzenie Math.min, ponieważ jeśli array byłyby różnej długości, to by poleciał Exception
  for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
    sum += arr1[i] + arr2[i];
  }

  return sum
}

/*
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Popularną libką do operacji na obiektach i tablicach jest lodash
 */

function sumArray2(arr1, arr2) {
  // jeśli masz kilka arrayów, np. [1,2,3],['a','b','c'] to efektem zip jest [[1,'a'],[2,'b'],[3,'c']]
  // z kolei sum, to po prostu suma elementów tablicy, czyli _.sum([1,2,3]) = 1 + 2 + 3 = 6
  // Nie trzeba robić dodatkowych testów, wyniki będzie miał zawsze tyle elementów, co mniejsza tablica
  return _.zip(arr1, arr2).map(_.sum)
}

// ------------------------ Re-Roll all fails functionality ------------------------

const reRollA = function (param) {
  const diceStats = DICES_STATS[param];
  /* Możesz sobie wybrać pola, które Cię interesują za jednym razem */
  const {count, data, uiInputElement} = diceStats;
  const newRolls = roller(count[1]);

  count[1] = 0
  dataCleanUp(uiInputElement, data);
  diceStats.data = sumArray2(data, newRolls);
  /*
    tutaj jest problem, bo 'data' jest referencją do pola w obiekcie i 'data = sumArray2(tempHitData, newRolls)'
    nie zmieniłoby 'data' wewnątrz 'diceStats', ewentualnie zadziałałoby
    'data.splice(0, Infinity, ...sumArray2(data, newRolls))'
  */

  updateUI(param, diceStats);
};

/*
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 Istnieje funkcja array.fill(element, start, koniec), która wypełnia elementy tablicy
 I jeszcze pytanie, czemu 'const dataCleanUp = function...', a nie 'function dataCleanUp(...'
*/
// const dataCleanUp = function (num, data) {
//   for (let i = 0; i < num.value; i++) {
//     data[i] = 0;
//   }
// };

function dataCleanUp(num, data) {
  data.fill(0, 0, num.value);
}

// ------------------------ 5+++ FNP functionality ------------------------

const FNP = function (val) {
  const { count } = DICES_STATS[DICES.Save]
  const tempFNPData = roller(count[1]);
  console.log("FNP rolls:" + tempFNPData);
  const tempFNPCount = counter(tempFNPData, val);
  fnpText.textContent = `${tempFNPCount[1]} DMG goes through`;
};

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
const btnCloseModal = document.querySelector(".close-modal");
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
