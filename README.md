# HTMLChess

A simple chess game built with HTML, CSS, and JavaScript.

A fully functional chess game built in JavaScript and html. The project implements official chess rules, move validation, and complete game state management without external libraries.

---

## Overview

This project was created to:
- Strengthen JavaScript fundamentals.
- Practice modular architecture, state management, and front end design and development.
- Implement complex rule based logic from scratch.

The project handles move validation, rule enforcement, and game state managment.

---

## Features

### Core Gameplay
- Turn based system
- Legal move validation
- Capture logic
- Check detection
- Checkmate detection
- Stalemate detection
- Draw detection
- Move history tracking
- Full board state management

---

## Tech Stack

- HTML
- CSS
- JavaScript

---

## Architecture

The project follows a modular architecture separating board state, move generation, piece logic, and ui.

### Game Flow

User Input
- Move generation
- Move validation
- Game state update
- Rule evaluation
- Render update

### Core Components

- **Board Module** - Manages board
- **Pieces Module** - Defines pieces and behaviours
- **Moves Module** - Generates and validates moves
- **Main Module** - Handles event listeners

---

## File Responsibilities

- **main.js**  
Handles user interaction and controls overall game flow.

- **board.js**  
Stores and updates board state.

- **pieces.js**  
Defines piece and their behavior.

- **moves.js**  
Generates legal moves and filters illegal moves based on king safety and rule compliance.

---

## Rule Implementation Strategy

### Move Validation

- Generate legal moves
- Simulate move
- Verify king safety
- Reject illegal states
- Confirm final move

### Check Detection

Determines check by:
- Identifying king position
- Generating opponent threat map
- Verifying attack overlap

### Draw Conditions

- **50-Move Rule**  
Tracks moves since last capture.

- **Threefold Repetition**  
Stores serialized board states and counts occurrences.

- **Stalemate**  
Confirms no legal moves while not in check.

---

## Design Decisions

- No external libraries were used to stregthen undesrtanding of core JavaScript
- Aspects of the game are put into their respective files.

---

### Future Improvements

- AI bot opponents
- UI improvments

---

## License

This project is licensed under the MIT License — see the license file for details.

---

## Author

Justin Norton
https://github.com/JustinN9