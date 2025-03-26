import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { removeMessageById } from "./fetch";

export function displayMessages(containerId) {
    const messagesRef = ref(database, 'messages'); 
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    container.style.position = "relative";
    const placedMessages = [];

    onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        container.innerHTML = ""; 
        placedMessages.length = 0;

        if (messages) {
            Object.entries(messages).forEach(([id, message]) => { 
                const messageElement = createMessageElement(id, message, container, placedMessages);
                container.appendChild(messageElement);
            });
        } else {
            container.innerHTML = "<p>No messages available.</p>";
        }
    });
}

function createMessageElement(id, message, container, placedMessages) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.setAttribute("data-id", id);

    const username = document.createElement("h4");
    username.textContent = message._username;

    const text = document.createElement("p");
    text.textContent = message._message;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("removeButton");

    const color = message._color;
    messageDiv.style.borderColor = color;
    messageDiv.append(username, text, removeButton);
   

    messageDiv.addEventListener("click", async () => {
        console.log(id);
        removeMessageById(id);
        const allmessages = document.querySelectorAll(".message");
        allmessages.forEach((message) => {
            const delay = Math.random() * 500; // Random delay in milliseconds
            setTimeout(() => {
                message.classList.add('shake');
            }, delay);
        });
    });

    
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const messageWidth = 150;
    const messageHeight = 100;

    let randomX, randomY, isOverlapping;

    do {
        randomX = Math.random() * (containerWidth - messageWidth);
        randomY = Math.random() * (containerHeight - messageHeight);

        isOverlapping = placedMessages.some(([x, y]) => {
            return (
                randomX < x + messageWidth &&
                randomX + messageWidth > x &&
                randomY < y + messageHeight &&
                randomY + messageHeight > y
            );
        });
    } while(isOverlapping)

    placedMessages.push([randomX, randomY]);

    messageDiv.style.position = "absolute";
    messageDiv.style.left = `${randomX}px`;
    messageDiv.style.top = `${randomY}px`;

    return messageDiv;
}