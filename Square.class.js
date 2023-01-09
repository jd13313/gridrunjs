class Square {
    constructor(character = '', touchable = true) {
        this.touched = false;
        this.touchable = touchable;
        this.character = character;
        this.isPlayer = false;
    }
}