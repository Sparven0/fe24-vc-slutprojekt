export class Message {
    constructor(username, message, color, shadowBanned=false) {
        this._username = username;
        this._message = message;
        this._color = color;
        this._shadowBanned = shadowBanned;
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
    get shadowBanned() {
        return this._shadowBanned;
    } 
}
