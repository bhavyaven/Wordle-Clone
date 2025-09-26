# WORDLE CLONE
The completed JavaScript code in ```student-implementation.js``` covers all of the required functions as well as the extra-credit functions. 

My implementation approach was to work through each of the functions as seen in the starter code in ```student-implementation.js```. I noted when I was calling another function, I needed to implement and the context in which I was calling it. This helped me understand how each function fit together with the others when processing the backend work for the Wordle Clone. After implementing each function, I ran a test using the Wordle output, taking note of any errors or unexpected outputs to debug within the function I was working on. Once I was confident in my implementation of the Core Game Functions, I proceeded to the Advanced Functions, following a similar strategy of implementation and testing. 

```initializeGame()```
- Resets all game state variables and the board
- Populates ```currentWord``` with a random word from the ```WordleWords``` list

```handleKeyPress(key)```:
- Processes any keys pressed
- Updates variables based on letter key inputs (A-Z) and processes key into ```currentGuess```
- Handles "ENTER" key and submits guess or sends error message if guess is incomplete
- Handles "BACKSPACE" key and updates tile display with removal of letter from ```currentGuess```

```submitGuess()```:
- Checks if guess is complete; throws an error message if incomplete
- Validates if the submitted guess is a valid word according to ```WordleWords```
- Calls ```checkLetter``` for each character and stores the state of each of them
- Calls ```updateKeyboardColors``` and appropriate functions to handle if the correct word has been guessed or not

```checkLetter(guessLetter, position, targetWord)```:
- Updates state of the argument letter in comparison to the ```targetWord``` ('correct', 'present', or 'absent')
- Handles cases of duplicate letters in ```currentWord``` and in ```currentGuess```

```updateGameState()```:
- Handles win/lose situations
- Displays appropriate end game modals with statistics

## WIN/LOSE SCREENSHOTS
<img width="541" height="823" alt="image" src="https://github.com/user-attachments/assets/ba5925f0-671c-447d-97c3-9fb4cc13916e" />

<img width="491" height="823" alt="image" src="https://github.com/user-attachments/assets/c7f75040-cc3f-42ad-97e7-be4f4c953ffc" />

<img width="453" height="828" alt="image" src="https://github.com/user-attachments/assets/ccb54e5d-4056-4a6b-a324-b0818fe8b095" />
