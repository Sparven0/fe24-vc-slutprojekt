import { database } from "./firebase";
import { ref, onValue } from "firebase/database";
import { removeMessageById } from "./fetch";

export function displayMessages(containerId) {
  const messagesRef = ref(database, "messages");
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  container.style.position = "relative";

  const displayedMessages = {};

  onValue(messagesRef, (snapshot) => {
    const messages = snapshot.val();

    Object.keys(displayedMessages).forEach((id) => {
      if (!messages || !messages[id]) {
        const messageElement = displayedMessages[id];
        if (messageElement) {
          container.removeChild(messageElement);
          delete displayedMessages[id];
        }
      }
    });

    if (messages) {
      Object.entries(messages).forEach(([id, message]) => {
        if (!displayedMessages[id]) {
          const messageElement = createMessageElement(
            id,
            message,
            container,
            displayedMessages
          );
          container.appendChild(messageElement);
          displayedMessages[id] = messageElement;
        }
      });
    }
  });
}

function createMessageElement(id, message, container, displayedMessages) {
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

  removeButton.addEventListener("click", async () => {
    console.log(`Removing message with ID: ${id}`);
    await removeMessageById(id);
  });

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const messageWidth = 150;
  const messageHeight = 100;

  let randomX, randomY, isOverlapping;

  do {
    randomX = Math.floor(Math.random() * (containerWidth - messageWidth));
    randomY = Math.floor(Math.random() * (containerHeight - messageHeight));

    isOverlapping = Object.values(displayedMessages).some((existingMessage) => {
      const existingX = parseInt(existingMessage.style.left, 10);
      const existingY = parseInt(existingMessage.style.top, 10);

      return (
        randomX < existingX + messageWidth &&
        randomX + messageWidth > existingX &&
        randomY < existingY + messageHeight &&
        randomY + messageHeight > existingY
      );
    });
  } while (isOverlapping);

  messageDiv.style.position = "absolute";
  messageDiv.style.left = `${randomX}px`;
  messageDiv.style.top = `${randomY}px`;

  return messageDiv;
}