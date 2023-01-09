class Row {
    constructor(columnCount = 5, blankChar) {
        this.columnCount = columnCount;
        this.characters = '';
        this.blankChar = blankChar;
    };

    getSquares() {
        let characters = [];

        for (let i = 0; i < this.columnCount; i++) {
            characters.push(new Square(this.blankChar));
        }

        return characters;
    }
}