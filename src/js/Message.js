export class Message {
    constructor(username, message, color) {
        this._username = username;
        this._message = message;
        this._color = color;
    }
    get username() {
        return this._username;
    }
    get message() {
        return this._message;
    }
    get color() {
        return this._color;
    } 
}
