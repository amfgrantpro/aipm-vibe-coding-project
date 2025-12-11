# Agent Instructions for Tic-Tac-Toe Tutorial Project

## Project Overview
This project contains a Jupyter notebook tutorial that teaches how to build a simple tic-tac-toe game in Python. The tutorial is structured progressively, from basic board setup to a complete playable game.

## Agent Guidelines

### 1. Code Quality Standards
- **Clear Documentation**: All functions must include docstrings explaining parameters and return values
- **Type Hints**: Consider using type hints for better code clarity (optional for this project)
- **Comments**: Inline comments should explain complex logic, especially in game state management
- **Naming Conventions**: Use descriptive variable names (e.g., `current_player` instead of `cp`)

### 2. Tutorial Structure
When modifying the notebook:
- Maintain the step-by-step progression from simple to complex
- Each section should include:
  - Explanatory markdown with clear purpose
  - Code implementation
  - Test examples or output
- Use the position numbering system (0-8) consistently throughout

### 3. Game Logic Components
Protect these core functions when making changes:
- `display_board()` - Renders the game state visually
- `is_valid_move()` - Validates move legality
- `check_winner()` - Detects winning conditions (8 combinations)
- `is_board_full()` - Detects draw state
- `play_tic_tac_toe()` - Main game loop and orchestration

### 4. Testing Requirements
- Test functions should demonstrate:
  - Valid move scenarios
  - Invalid move handling
  - Win condition detection
  - Draw scenarios
  - Edge cases

### 5. Enhancement Suggestions
When proposing enhancements, consider:
- AI opponent implementation (minimax algorithm)
- GUI versions (tkinter, pygame)
- Game statistics tracking
- Difficulty levels
- Network multiplayer capabilities

### 6. User Experience
- Ensure clear prompts for player input
- Display the position guide so players know where to move
- Provide helpful error messages for invalid inputs
- Show the current board state before each move

### 7. Code Organization
If converting to a standalone script:
- Keep game logic functions separate from the main game loop
- Place all win condition definitions at the top
- Group related functions together
- Consider adding a configuration section for easy modifications

## Common Tasks

### Adding a New Feature
1. Create a new cell in the appropriate section
2. Include markdown explanation above the code
3. Provide test examples
4. Update the summary if it changes game mechanics

### Debugging
- Use `display_board()` to visualize state at any point
- Add print statements in the game loop to trace moves
- Test functions individually before integration

### Performance Considerations
- Current implementation is optimal for a 3x3 board
- Win condition checking is O(1) with fixed 8 combinations
- Suitable for human players; would need optimization for AI

## Version Control
- Keep notebook in `.ipynb` format
- Commit working versions after major features
- Use descriptive commit messages for changes