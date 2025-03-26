export class Message {
  constructor(username, message, color, shadowBanned = false) {
    this._username = username;
    this._message = message;
    this._color = color;
    this._shadowBanned = shadowBanned;
  }
}
