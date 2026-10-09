
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const overlay = document.getElementById("overlay");
const result = document.getElementById("result");
const aiToggle = document.getElementById("ai");
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");

const P1 = "🍩";
const P2 = "🍌";

let board = Array(9).fill("");
let current = P1;
let active = true;
let locked = false;

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

/* Fruit trivia */

const doughnutFacts = [
  "The hole helps the dough cook more evenly. Ring-shaped doughnuts became popular in America during the 19th century.",
  "The Salvation Army served doughnuts to soldiers during World War I. Volunteers later inspired National Doughnut Day in 1938.",
  "Early Dutch settlers brought olykoeks, or oily cakes, to America. These fried treats helped inspire modern doughnuts."
];

const bananaFacts = [
  "Botanically, bananas are berries, but strawberries are not true botanical berries.",
  "A banana plant is a giant herb, not a tree. Its trunk-like structure is formed by tightly packed leaf bases.",
  "Wild bananas contain large, hard seeds. Most supermarket bananas are cultivated varieties with tiny, undeveloped seeds."
];

function showRandomFact(facts, elementId, storageKey) {
  const element = document.getElementById(elementId);

  if (!element || facts.length === 0) {
    return;
  }

  let index = Math.floor(Math.random() * facts.length);
  const previousIndex = sessionStorage.getItem(storageKey);

  // Avoid repeating the previous fact in the same browser tab.
  if (facts.length > 1 && previousIndex !== null) {
    while (index === Number(previousIndex)) {
      index = Math.floor(Math.random() * facts.length);
    }
  }

  element.textContent = facts[index];
  sessionStorage.setItem(storageKey, String(index));
}

showRandomFact(
  doughnutFacts,
  "doughnut-fact",
  "previousDoughnutFact"
);

showRandomFact(
  bananaFacts,
  "banana-fact",
  "previousBananaFact"
);

/* Game controls */

cells.forEach(cell => {
  cell.onclick = () => play(cell);

  cell.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      play(cell);
    }
  });
});

function play(cell) {
  if (!active || locked) {
    return;
  }

  const i = Number(cell.dataset.i);

  if (board[i]) {
    return;
  }

  place(i, current);

  if (checkEnd()) {
    return;
  }

  current = current === P1 ? P2 : P1;
  update();

  if (aiToggle.checked && current === P2) {
    locked = true;
    setTimeout(aiMove, 450);
  }
}

function place(i, symbol) {
  board[i] = symbol;
  cells[i].textContent = symbol;
  cells[i].classList.add("filled");
  cells[i].setAttribute(
    "aria-label",
    `Cell ${Number(i) + 1}: ${symbol}`
  );
}

function aiMove() {
  if (!active) {
    locked = false;
    return;
  }

  const move = bestMove();

  if (move === undefined) {
    locked = false;
    return;
  }

  place(move, P2);

  if (!checkEnd()) {
    current = P1;
    update();
  }

  locked = false;
}

function bestMove() {
  // First, take a winning move if one exists.
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = P2;

      if (isWin(P2)) {
        board[i] = "";
        return i;
      }

      board[i] = "";
    }
  }

  // Otherwise, block the human player's winning move.
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = P1;

      if (isWin(P1)) {
        board[i] = "";
        return i;
      }

      board[i] = "";
    }
  }

  // Otherwise, choose a random empty cell.
  const empty = board
    .map((value, index) => value === "" ? index : null)
    .filter(index => index !== null);

  if (empty.length === 0) {
    return undefined;
  }

  return empty[Math.floor(Math.random() * empty.length)];
}

function isWin(symbol) {
  return wins.some(pattern =>
    pattern.every(index => board[index] === symbol)
  );
}

function checkEnd() {
  if (isWin(current)) {
    endGame(`${name(current)} wins`);
    return true;
  }

  if (!board.includes("")) {
    endGame("Draw");
    return true;
  }

  return false;
}

function name(player) {
  if (player === P1) {
    return p1.value.trim() || "Player 1";
  }

  return aiToggle.checked
    ? "AI"
    : (p2.value.trim() || "Player 2");
}

function update() {
  status.textContent = `${name(current)} Turn ${current}`;
}

function endGame(message) {
  active = false;
  locked = false;
  result.textContent = message;
  overlay.style.display = "flex";
}

function resetGame() {
  board.fill("");
  active = true;
  locked = false;
  current = P1;
  overlay.style.display = "none";

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.classList.remove("filled");
    cell.setAttribute("aria-label", `Cell ${index + 1}`);
  });

  update();
}

document.getElementById("reset").onclick = resetGame;

update();
