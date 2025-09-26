/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 * 
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 * 
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = '';  // Set this to a random word
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;
    
    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    currentWord = WordleWords.getRandomWord();
    
    
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    resetBoard();
    
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    hideModal();

    console.log(currentWord);
}

/**
 * Handle keyboard input
 * POINTS: 15
 * 
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */
function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    if (gameOver) {
        return;
    }

    validateInput(key, currentGuess);
    // TODO: Handle letter keys (A-Z)
    // HINT: Use regex /^[A-Z]$/ to test if key is a letter
    // HINT: Check if currentGuess.length < WORD_LENGTH before adding
    // HINT: Use getTile() and updateTileDisplay() to show the letter
    if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
            const row = currentRow;
            const col = currentGuess.length;
            const tile = getTile(row, col);
            updateTileDisplay(tile, key);
            currentGuess += key;
        }
    }

    // TODO: Handle ENTER key
    // HINT: Check if guess is complete using isGuessComplete()
    // HINT: Call submitGuess() if complete, show error message if not
    if (key === 'ENTER') {
        if (isGuessComplete()) {
            submitGuess();
        } else {
            showMessage("Not enough letters!", 'error', 3000);
        }
        return;
    }

    // TODO: Handle BACKSPACE key  
    // HINT: Check if there are letters to remove
    // HINT: Clear the tile display and remove from currentGuess
    if (key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            const row = currentRow;
            const col = currentGuess.length - 1;
            const tile = getTile(row, col);
            updateTileDisplay(tile, ""); 
            currentGuess = currentGuess.slice(0, -1); 
        }
        return;
    }
}

/**
 * Submit and process a complete guess
 * POINTS: 20
 * 
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    // HINT: Use isGuessComplete()
    if (!isGuessComplete()) {
        showMessage("Not enough letters!", 'error', 3000);
        shakeRow(currentRow);
        return;
    }
    // TODO: Validate guess is a real word
    // HINT: Use WordleWords.isValidWord()
    // HINT: Show error message and shake row if invalid
    if (!WordleWords.isValidWord(currentGuess)) {
        showMessage("Invalid Word!", 'error', 3000);
        shakeRow(currentRow);
        return;
    }

    // TODO: Check each letter and get results
    // HINT: Use checkLetter() for each position
    // HINT: Store results in an array

    // TODO: Update tile colors immediately
    // HINT: Loop through results and use setTileState()
    let arr = new Array(currentGuess.length);
    for (let i = 0; i < currentGuess.length; i++) {
        arr[i] = checkLetter(currentGuess[i], i, currentWord);
        setTileState(getTile(currentRow, i), arr[i]);
    }

    // TODO: Update keyboard colors
    // HINT: Call updateKeyboardColors()
    updateKeyboardColors(currentGuess, arr);

    // TODO: Check if guess was correct
    // HINT: Compare currentGuess with currentWord
    
    // TODO: Update game state
    // HINT: Call updateGameState()
    if (currentGuess === currentWord) {
        processRowReveal(currentRow, arr)
        updateGameState(isCorrect=true)
    } else {
        updateGameState(isCorrect=false)
    }

    // TODO: Move to next row if game continues
    // HINT: Increment currentRow and reset currentGuess
    currentRow += 1
    currentGuess = '';
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)
 */
function checkLetter(guessLetter, position, targetWord) {
    // TODO: Convert inputs to uppercase for comparison

    // TODO: Check if letter is in correct position
    // HINT: Compare targetWord[position] with guessLetter

    // TODO: Check if letter exists elsewhere in target
    // HINT: Use targetWord.includes() or indexOf()

    // TODO: Handle duplicate letters correctly
    // This is the most challenging part - you may want to implement
    // a more sophisticated algorithm that processes the entire word

    let results = new Array(currentGuess.length).fill('absent');
    let letterCounts = {};

    for (let i = 0; i < targetWord.length; i++) {
        let l = targetWord[i];
        letterCounts[l] = (letterCounts[l] || 0) + 1;
    }

    for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i] === targetWord[i]) {
            results[i] = 'correct';
            letterCounts[currentGuess[i]]--;
        }
    }

    for (let i = 0; i < currentGuess.length; i++) {
        if (results[i] === 'correct') {
            continue;
        }
        let l = currentGuess[i];
        if (letterCounts[l] > 0) {
            results[i] = 'present';
            letterCounts[l]--;
        }
    }
    return results[position];
}

/**
 * Update game state after a guess
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    // TODO: Handle win condition
    // HINT: Set gameWon and gameOver flags, call showEndGameModal
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        showEndGameModal(gameWon, currentWord);
    }
    // TODO: Handle lose condition  
    // HINT: Check if currentRow >= MAX_GUESSES - 1
    if (currentRow >= MAX_GUESSES - 1) {
        gameWon = false;
        gameOver = true;
        showEndGameModal(gameWon, currentWord);
    }
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
function updateKeyboardColors(guess, results) {
    // TODO: Loop through each letter in the guess

    // TODO: Get the keyboard key element
    // HINT: Use document.querySelector with [data-key="LETTER"]
    
    // TODO: Apply color with priority system
    // HINT: Don't change green keys to yellow or gray
    // HINT: Don't change yellow keys to gray
    for (let i = 0; i < guess.length; i++) {
        let k = document.querySelector(`[data-key="${guess[i]}"]`);
        if (results[i] === 'correct') {
            if (k.classList.contains('present')) {
                k.classList.remove('present');
            }
            k.classList.add('correct');
        } else if (!k.classList.contains('correct') && results[i] === 'present') {
            k.classList.add('present');
        } else if (!k.classList.contains('correct') && !k.classList.contains('present')) {
            k.classList.add('absent');
        }
    }
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 * 
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    // TODO: Check if all results are 'correct'
    // HINT: Use results.every() method
    
    // TODO: If all correct, trigger celebration
    // HINT: Use celebrateRow() function
    if (results.every(checkLetter)) {
        celebrateRow(rowIndex);
    }
}

/**
 * Show end game modal with results
 * POINTS: 10
 * 
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    // TODO: Create appropriate message based on won parameter
    // HINT: For wins, include number of guesses used
    // HINT: For losses, reveal the target word 
    if (won) {
        showMessage(`Solved in ${currentRow + 1} guesses!`, 'success', 5000);
    } else {
        showMessage(`Better luck next time! Answer: ${currentWord}`, 'info', 5000);
    }
    
    // TODO: Update statistics
    // HINT: Use updateStats() function
    updateStats(won);

    // TODO: Show the modal
    // HINT: Use showModal() function
    showModal(won, currentWord, (currentRow + 1));
}

/**
 * Validate user input before processing
 * POINTS: 5
 * 
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    // TODO: Return false if game is over
    if (gameOver) {
        return false;
    }
    
    // TODO: Handle letter keys
    // HINT: Check if currentGuess.length < WORD_LENGTH
    if (currentGuess.length < WORD_LENGTH) {
        if (/^[A-Z]$/.test(key)) {
            return true;
        }
    }
    
    // TODO: Handle ENTER key
    // HINT: Check if currentGuess.length === WORD_LENGTH
    if (currentGuess.length === WORD_LENGTH) {
        if (key === 'ENTER') {
            return true;
        }
    }
    
    // TODO: Handle BACKSPACE key
    // HINT: Check if currentGuess.length > 0
    if (currentGuess.length > 0) {
        if (key === 'BACKSPACE') {
            return true;
        } 
    }
    return false;
}