import { Message } from "./Message.js";
import { postMessage } from "./fetch.js";
import { Fireworks } from 'fireworks-js'


const messageForm = document.getElementById('messageForm');
messageForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const username = formData.get('username');
    const message = formData.get('messageTxt');
    const color = createRandomColor();
    const shadowBanned = formData.get('shadowBanned'); //alriks test input för att man kan sätt shadowBanned

 



    if (!username || !message) {
        console.error("Username and message are required");
        return;
    }
    const messageObj = new Message(username, message, color, shadowBanned);

    try {
        const response = await postMessage(messageObj);
        if (response.success) {
            console.log("Message posted successfully:", response.id);
            const container = document.getElementById('messagesContainer');
            const fireworksContainer = document.createElement("div");
            fireworksContainer.id = "fireworksContainer";
            fireworksContainer.style.position = "absolute";
            fireworksContainer.style.top = "0";
            fireworksContainer.style.left = "0";
            fireworksContainer.style.width = "100%";
            fireworksContainer.style.height = "100%";
            fireworksContainer.style.pointerEvents = "none";
            fireworksContainer.style.zIndex = "9999";
            container.appendChild(fireworksContainer);


            const fireworks = new Fireworks(fireworksContainer, {
                autoresize: true,
                opacity: 0.5,
                acceleration: 1.05,
                friction: 0.98,
                gravity: 1.5,
                particles: 150, 
                trace: 3, 
                explosion: 10, 
                intensity: 50, 
                flickering: 50,
                lineWidth: {
                    trace: 2,
                    explosion: 4, 
                },
                brightness: {
                    min: 50,
                    max: 80,
                    decay: {
                        min: 0.015,
                        max: 0.03,
                    },
                },
                hue: {
                    min: 0,
                    max: 360,
                },
                delay: {
                    min: 30,
                    max: 60,
                },
            });
            fireworks.start();

            setTimeout(() => fireworks.stop(), 5000);

        } else {
            console.error("Failed to post message:", response.error);
        }
    } catch (error) {
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






