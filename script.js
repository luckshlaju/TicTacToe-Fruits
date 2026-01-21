const cells = document.querySelectorAll(".cell")
const status = document.getElementById("status")
const overlay = document.getElementById("overlay")
const result = document.getElementById("result")
const aiToggle = document.getElementById("ai")
const p1 = document.getElementById("p1")
const p2 = document.getElementById("p2")

const P1 = "🍩"
const P2 = "🍌"

let board = Array(9).fill("")
let current = P1
let active = true
let locked = false

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

cells.forEach(c => c.onclick = () => play(c))

function play(cell) {
  if (!active || locked) return

  const i = cell.dataset.i
  if (board[i]) return

  place(i, current)
  if (checkEnd()) return

  current = current === P1 ? P2 : P1
  update()

  if (aiToggle.checked && current === P2) {
    locked = true
    setTimeout(aiMove, 450)
  }
}

function place(i, s) {
  board[i] = s
  cells[i].textContent = s
  cells[i].classList.add("filled")
}

function aiMove() {
  let move = bestMove()
  place(move, P2)
  if (!checkEnd()) {
    current = P1
    update()
  }
  locked = false
}

function bestMove() {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = P2
      if (isWin(P2)) {
        board[i] = ""
        return i
      }
      board[i] = ""
    }
  }

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = P1
      if (isWin(P1)) {
        board[i] = ""
        return i
      }
      board[i] = ""
    }
  }

  const empty = board
    .map((v,i) => v === "" ? i : null)
    .filter(v => v !== null)

  return empty[Math.floor(Math.random() * empty.length)]
}

function isWin(s) {
  return wins.some(p => p.every(i => board[i] === s))
}

function checkEnd() {
  if (isWin(current)) {
    endGame(name(current) + " wins")
    return true
  }
  if (!board.includes("")) {
    endGame("Draw")
    return true
  }
  return false
}

function name(p) {
  if (p === P1) return p1.value || "Player 1"
  return aiToggle.checked ? "AI" : (p2.value || "Player 2")
}

function update() {
  status.textContent = name(current) + " Turn " + current
}

function endGame(text) {
  active = false
  result.textContent = text
  overlay.style.display = "flex"
}

function resetGame() {
  board.fill("")
  active = true
  locked = false
  current = P1
  overlay.style.display = "none"
  cells.forEach(c => {
    c.textContent = ""
    c.classList.remove("filled")
  })
  update()
}

document.getElementById("reset").onclick = resetGame
update()
