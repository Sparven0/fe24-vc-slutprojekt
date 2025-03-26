import { database } from "./firebase";
import { ref, onValue } from "firebase/database";

export function displayMessages(containerId) {
    const messagesRef = ref(database, 'messages'); 
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    onValue(messagesRef, (snapshot) => {
        const messages = snapshot.val();
        container.innerHTML = ""; 

        if (messages) {
            Object.entries(messages).forEach(([id, message]) => { 
                const messageElement = createMessageElement(id, message);
                container.appendChild(messageElement);
            });
        } else {
            container.innerHTML = "<p>No messages available.</p>";
        }
    });
}

function createMessageElement(id, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.setAttribute("data-id", id);

    const username = document.createElement("h4");
    username.textContent = message._username;

    const text = document.createElement("p");
    text.textContent = message._message;

    const color = message._color;
    messageDiv.style.borderColor = color;
    
    const shadowBanned = message._shadowBanned;
    messageDiv.classList.add("shadowBanned");

    messageDiv.appendChild(username);
    messageDiv.appendChild(text);

    return messageDiv;
}