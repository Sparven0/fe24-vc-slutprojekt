import { Message } from "./Message";
import { postMessage } from "./fetch.js";

const messageForm = document.getElementById('messageForm');
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const username = formData.get('username');
    const message = formData.get('messageTxt');
    const color = createRandomColor();
    const shadowBanned = formData.get('shadowBanned'); //alriks test input för att man kan sätt shadowBanned

    if(!username || !message) {
        console.error("Username and message are required");
        return;
    }
    const messageObj = new Message(username, message, color, shadowBanned);

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


function createRandomColor() {
    const timestamp = Date.now();
    const red = timestamp % 256;
    const green = (timestamp >> 8) % 256;
    const blue = (timestamp >> 16) % 256;
    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    console.log(rgbColor);
    return rgbColor;
}





