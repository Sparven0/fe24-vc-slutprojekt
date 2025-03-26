import { Message } from "./Message";
import { postMessage } from "./fetch";

const messageForm = document.getElementById('messageForm');
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const username = formData.get('username');
    const message = formData.get('messageTxt');
    const color = formData.get('color') || '#000000';

    if(!username || !message) {
        console.error("Username and message are required");
        return;
    }
    const messageObj = new Message(username, message, color);

    try {
        const response = await postMessage(messageObj);
        if(response.success) {
            console.log("Message posted successfully:", response.id);
        } else {
            console.error("Failed to post message:", response.error);
        }
    } catch(error) {
        console.error("Error posting message:", error);
    }
});