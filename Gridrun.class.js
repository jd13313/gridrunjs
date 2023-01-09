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

    debug() {
        console.log(
            `
                Row: ${this.playerCoords.row}
                Col: ${this.playerCoords.col}
            `
        );
    }


    movePlayer(direction) {
        // Remove player from previous square, indicate they were there.
        this.board[this.playerCoords.row][this.playerCoords.col].character = this.visitedChar;
        this.board[this.playerCoords.row][this.playerCoords.col].isPlayer = true;

        // Handle the directional move
        switch(direction) {
            case 'down':
                if (this.playerCoords.row < (this.rowCount - 1)) {
                    this.playerCoords.row++;
                }
                break;

            case 'up':
                if (this.playerCoords.row > 0) {
                    this.playerCoords.row--;
                }
                break;


            case 'left':
                if (this.playerCoords.col > 0) {
                    this.playerCoords.col--;
                }
                break;

            case 'right':
                if (this.playerCoords.col < (this.colCount - 1)) {
                    this.playerCoords.col++;
                }
                break;
            
            default:
        }


        this.scores.moves++;
        // Redraw game board
        this.drawBoard();
    }

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