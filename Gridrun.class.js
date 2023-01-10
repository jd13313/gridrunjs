class Gridrun {
    constructor(gameElement, rowCount = 10, colCount = 10) {
        this.gameElement = gameElement;
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.board = [];
        this.playerChar = '☼';
        this.visitedChar = '♦';
        this.blankChar = '□'
        this.playerCoords = {
            col: 0,
            row: 0
        };
        this.scores = {
            moves: 0,
        }

        this.initializeGame();
    }

    /**
     * Created initial HTML for gameboard, adds event listeners, and finally draws the gameboard.
     */
    initializeGame() {
        this.gameElement.appendChild(document.createElement('ul'));

        for (let i = 0; i < this.rowCount; i++) {
            this.board.push(new Row(this.colCount, this.blankChar).getSquares());
        }

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

        this.drawBoard();
    }

    
    /**
     * Draws gameboard
     */
    drawBoard() {
        document.getElementById('scoreMoves').innerText = this.scores.moves;
        

        // Identify player
        this.board[this.playerCoords.row][this.playerCoords.col] = {
            ...this.board[this.playerCoords.row][this.playerCoords.col],
            character: this.playerChar,
            isPlayer: true
        }

        this.gameElement.innerHTML = '';
        this.board.forEach(row => {
            const listItem = document.createElement('li');
            let rowText = '';


            row.forEach(square => {
                rowText += square.character;
            });
            listItem.innerHTML = rowText;


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
            // Redraw game board
            this.drawBoard();
        }        
    }

    /**
     * Checks if provided coordinates can be visited by player.
     * @param {int} row 
     * @param {int} col 
     * @returns 
     */
    canMoveToSquare(row, col) {
        return !this.board[row][col].visited;
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

        this.drawBoard();
    }

    
}