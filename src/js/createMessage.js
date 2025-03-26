import { Message } from "./Message";
import { postMessage } from "./fetch";

const messageForm = document.getElementById('#messageForm');
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const username = formData.get('username');
    const message = formData.get('messageTxt');
    const color = formData.get('color');
    const messageObj = new Message(username, message, color);
    await postMessage(messageObj);
})