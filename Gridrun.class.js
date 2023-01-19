class Gridrun {
    constructor(gameElement, rowCount = 10, colCount = 10) {
        this.gameElement = gameElement;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.board = [];
        this.playerChar = '😀';
        this.visitedChar = '💩';
        this.blankChar = '🍎'
        this.playerCoords = {};
        this.scores = {
            moves: 0,
        }
        this.eventListenersCreated = false;

        this.initializeGame();
    }

    /**
     * Created initial HTML for gameboard, adds event listeners, and finally draws the gameboard.
     */
    initializeGame() {
        // Build the board elements
        this.gameElement.innerHTML = '';
        this.board = [];
        this.playerCoords = {
            col: 0,
            row: 0
        };
        this.gameElement.appendChild(document.createElement('ul'));

        for (let i = 0; i < this.rowCount; i++) {
            this.board.push(new Row(this.colCount, this.blankChar).getSquares());
        }

        // If event listeners haven't already been created, create them. 
        // For example, if player reset game, listeners will already exist.
        if (!this.eventListenersCreated) {
            document.addEventListener('keydown', (event) => {
                switch(event.key){
                    case 'ArrowUp':
                        this.movePlayer('up');
                        break;
                    case 'ArrowDown':
                        this.movePlayer('down');
                        break;
                    case 'ArrowLeft':
                        this.movePlayer('left');
                        break;
                    case 'ArrowRight':
                        this.movePlayer('right');
                        break;
                    default:
                }
            })
            
            document.getElementById('resetBoard').addEventListener('click', () => {
                this.resetBoard();
            });

            this.eventListenersCreated = true;
        }

        // Finally, draw the board.
        this.drawBoard();
    }

    
    /**
     * Draws gameboard
     */
    drawBoard(charUpdates = {}) {
        document.getElementById('scoreMoves').innerText = this.scores.moves;

        const playerChar = charUpdates?.player ?? this.playerChar;
        
        // Identify player
        this.board[this.playerCoords.row][this.playerCoords.col] = {
            ...this.board[this.playerCoords.row][this.playerCoords.col],
            character: playerChar,
            isPlayer: true
        }

        this.gameElement.innerHTML = '';
        this.board.forEach(row => {
            const listItem = document.createElement('li');
            const colList = document.createElement('ul');

            row.forEach(square => {
                const colListItem = document.createElement('li');
                colListItem.innerHTML = `<span>${square.character}</span>`;
                colList.appendChild(colListItem);
            });


            listItem.appendChild(colList);


            this.gameElement.appendChild(listItem);
        });
    }

    /**
     * Dumps player coords and any future helpful debug info to console log.
     */
    debug() {
        console.log(
            `
                Row: ${this.playerCoords.row}
                Col: ${this.playerCoords.col}
            `
        );
    }

    /**
     * Handles player movement
     * @param {string} direction  (up, down, left, right)
     */
    movePlayer(direction) {
        // Remove player from previous square, indicate they were there.
        this.board[this.playerCoords.row][this.playerCoords.col].character = this.visitedChar;
        this.board[this.playerCoords.row][this.playerCoords.col].isPlayer = true;
        this.board[this.playerCoords.row][this.playerCoords.col].visited = true;

        // Handle the directional move
        let newRow = this.playerCoords.row;
        let newCol = this.playerCoords.col;

        switch(direction) {
            case 'down':
                if (this.playerCoords.row < (this.rowCount - 1)) {
                    newRow++;
                }
                break;

            case 'up':
                if (this.playerCoords.row > 0) {
                    newRow--;
                }
                break;


            case 'left':
                if (this.playerCoords.col > 0) {
                    newCol--;
                }
                break;

            case 'right':
                if (this.playerCoords.col < (this.colCount - 1)) {
                    newCol++;
                }
                break;
            
            default:
        }

        if (this.canMoveToSquare(newRow, newCol)) {
            this.scores.moves++;

            this.playerCoords.row = newRow;
            this.playerCoords.col = newCol;

            this.drawBoard({
                player: '😐'
            });

            setTimeout(() => {
                this.drawBoard();
            }, 250)
        }        
    }

    /**
     * Checks if provided coordinates can be visited by player.
     * @param {int} row 
     * @param {int} col 
     * @returns 
     */
    canMoveToSquare(row, col) {
        if(this.board[row][col].visited || this.board[row][col].vistable === false) {
            return false;
        }

        return true;
    }

    /**
     * Reset gameboard to initial state...sorta.
     */
    resetBoard() {
        this.gameElement.classList.add('resetting');

        this.playerCoords = {
            col: 0,
            row: 0
        };

        Object.keys(this.scores).forEach(scoreKey => {
            this.scores[scoreKey] = 0;
        });

        // Set all characters to bombs
        this.updateAllChars('💣');

        setTimeout(() => {
            this.updateAllChars('💥');
            setTimeout(() => {
                this.gameElement.classList.remove('resetting');
                this.initializeGame();
            }, 500)
        }, 500);
    }

    /**
     * Replace all characters on board with given character
     * @param {string} char 
     */
    updateAllChars(char) {
        this.board.forEach(row => {
            row.forEach(col => {
                col.character = char;
            })
        });

        this.drawBoard();
    }    
}