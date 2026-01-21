# Tic Tac Toe Void

A modern, Gen-Z styled Tic Tac Toe game that focuses on atmosphere, restraint, and clean interaction instead of flashy gimmicks.

This is not a tutorial clone.  
This is a minimal digital playground with intentional design.

---

## Features

- Two-player mode by default
- Optional AI opponent
- Doughnut 🍩 vs Banana 🍌 symbols
- Fixed, stable board with no layout shifts
- Turn-safe logic with AI lock
- Player name customization
- Clean win and draw modal
- Ambient trivia panels for subtle personality
- Modern dark UI with restrained neon accents

---

## Tech Stack

- HTML5  
- CSS3  
- Vanilla JavaScript  

No frameworks. No libraries. No dependencies.

---

## Gameplay Rules

- Player 1 plays as 🍩
- Player 2 or AI plays as 🍌
- Players take turns placing their symbol
- First to align three symbols wins
- If all cells fill with no winner, the game ends in a draw

---

## AI Logic

The AI uses a simple but effective strategy:
- Always attempts a winning move first
- Blocks the opponent’s winning move if needed
- Otherwise chooses a random valid position

Input is locked during the AI turn to prevent race conditions.

---

## Project Goal

This project was built to explore:
- Clean UI hierarchy
- State-safe game logic
- Minimal but expressive design
- Moving beyond beginner-level layouts

The focus is not complexity, but polish.

---

## How to Run

1. Clone the repository
2. Open `index.html` in a browser
3. Play

No build step required.

---

## Screenshots

Intentionally minimal.  
The experience is better when interacted with directly.

---

## Future Improvements

- Difficulty levels for AI
- Score persistence
- Mobile-first layout refinement
- Subtle motion or sound feedback

---

## License

Open for learning and experimentation.
