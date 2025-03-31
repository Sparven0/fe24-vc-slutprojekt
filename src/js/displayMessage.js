import { database } from "./firebase";
import { ref, onValue, update } from "firebase/database";
import { removeMessageById } from "./fetch";
import { shuffleMessages } from "./shuffleMessages";

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

    // Remove deleted messages
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
      const sorted = Object.entries(messages).sort((a, b) => {
        return (b[1].pinned === true) - (a[1].pinned === true); // Pinned first
      });

      sorted.forEach(([id, message]) => {
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

  if (message.pinned) {
    messageDiv.classList.add("pinned");
  }

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("contentContainer");

  const username = document.createElement("h4");
  username.textContent = message._username;

  const text = document.createElement("p");
  text.textContent = message._message;

  contentContainer.append(username, text);

  const removeButton = document.createElement("button");
  removeButton.textContent = "❌";
  removeButton.classList.add("removeButton");

  const pinButton = document.createElement("button");
  pinButton.textContent = "📌";
  pinButton.classList.add("pinButton");

  // 🔁 Toggle pin state in Firebase + UI
  pinButton.addEventListener("click", async () => {
    const newPinned = !message.pinned;
    let updates = { pinned: newPinned };

    if (newPinned) {
      const x = parseInt(messageDiv.style.left, 10);
      const y = parseInt(messageDiv.style.top, 10);
      updates.x = x;
      updates.y = y;
    } else {
      updates.x = null;
      updates.y = null;
    }

    await update(ref(database, `messages/${id}`), updates);

    message.pinned = newPinned;
    pinButton.textContent = "📌";
    messageDiv.classList.toggle("pinned", newPinned);
  });

  const color = message._color;
  messageDiv.style.borderColor = color;


  if (message._shadowBanned) {
    messageDiv.classList.add("shadowBanned");
  }

  messageDiv.append(contentContainer, removeButton, pinButton);

  removeButton.addEventListener("click", async () => {
    console.log(id);
    removeMessageById(id);
    const allmessages = document.querySelectorAll(".message");
    allmessages.forEach((msg) => {
      const delay = Math.random() * 500;
      setTimeout(() => {
        msg.classList.add("shake");
        setTimeout(() => {
          msg.classList.remove("shake");
        }, 1000);
      }, delay);
    });
  });

  // 📌 If pinned with saved position, place it exactly
  if (message.pinned && typeof message.x === "number" && typeof message.y === "number") {
    messageDiv.style.position = "absolute";
    messageDiv.style.left = `${message.x}px`;
    messageDiv.style.top = `${message.y}px`;
    return messageDiv;
  }

  // 🔀 Otherwise, random position (non-pinned)
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const messageWidth = 150;
  const messageHeight = 100;

  let randomX, randomY, isOverlapping;

  container.appendChild(messageDiv);
  const actualMessageWidth = messageDiv.offsetWidth;
  const actualMessageHeight = messageDiv.offsetHeight;
  container.removeChild(messageDiv);

  let attempts = 0; // Add a counter to limit iterations
  const maxAttempts = 100; // Set a maximum number of attempts

  let randomX, randomY, isOverlapping;
  do {
    randomX = Math.floor(Math.random() * (containerWidth - actualMessageWidth));
    randomY = Math.floor(Math.random() * (containerHeight - actualMessageHeight));

    isOverlapping = Object.values(displayedMessages).some((existingMessage) => {
      const existingX = parseInt(existingMessage.style.left, 10);
      const existingY = parseInt(existingMessage.style.top, 10);

      return (
        randomX < existingX + existingMessage.offsetWidth &&
        randomX + actualMessageWidth > existingX &&
        randomY < existingY + existingMessage.offsetHeight &&
        randomY + actualMessageHeight > existingY
      );
    });
  } while (isOverlapping);

  if (randomX + actualMessageWidth > containerWidth) {
    randomX = containerWidth - actualMessageWidth;
  }
  if (randomY + actualMessageHeight > containerHeight) {
    randomY = containerHeight - actualMessageHeight;
  }

  messageDiv.style.position = "absolute";
  messageDiv.style.left = `${randomX}px`;
  messageDiv.style.top = `${randomY}px`;

  return messageDiv;
}

// 🌀 Shuffle Button
const shuffleButton = document.getElementById("shuffleButton");
shuffleButton.addEventListener("click", shuffleMessages);
