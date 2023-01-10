class Square {
    constructor(character = '', visitable = true) {
        this.visited = false;
        this.visitable = visitable;
        this.character = character;
        this.isPlayer = false;
    }
}