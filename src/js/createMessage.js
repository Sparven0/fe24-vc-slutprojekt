import { Message } from "./Message";
import { postMessage } from "./fetch.js";

const messageForm = document.getElementById('messageForm');
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const username = formData.get('username');
    const message = formData.get('messageTxt');
    const color = createRandomColor();
 


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




let difference = 0;
const MIN_COLOR_VALUE = 100;

function createRandomColor() {
    const timestamp = Date.now();

    let red = (timestamp + difference) % 256;
    let green = ((timestamp + difference) >> 8) % 256;
    let blue = ((timestamp + difference) >> 16) % 256;
    red = Math.max(red, MIN_COLOR_VALUE);
    green = Math.max(green, MIN_COLOR_VALUE);
    blue = Math.max(blue, MIN_COLOR_VALUE);
    const MIN_DIFF = 50; 
    if (Math.abs(red - green) < MIN_DIFF) {
        green = (green + 100) % 256;
    }
    if (Math.abs(green - blue) < MIN_DIFF) {
        blue = (blue + 100) % 256;
    }
    if (Math.abs(blue - red) < MIN_DIFF) {
        red = (red + 100) % 256;
    }

    const rgbColor = `rgb(${red}, ${green}, ${blue})`;
    console.log(rgbColor);

    difference += 100;
    return rgbColor;
}






