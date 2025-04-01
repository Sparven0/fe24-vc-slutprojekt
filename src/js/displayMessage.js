import { database } from "./firebase";
import { ref, onValue, update, get } from "firebase/database";
import { removeMessageById } from "./fetch";
import { shuffleMessages } from "./shuffleMessages";

let isRemoving = false;

export function displayMessages(containerId) {
  
  const messagesRef = ref(database, "messages");
  const usersRef = ref(database, "users");
  const container = document.getElementById(containerId);

  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  container.style.position = "relative";

  const displayedMessages = {};

  async function updateDisplayedMessages(messages) {
    const selectedUserId = document.getElementById("usernameSelect").value;
    const userRef = ref(database, `users/${selectedUserId}`);
    const userSnapshot = await get(userRef);
    const currentUser = userSnapshot.val();

    if (!currentUser) {
      console.error("Current user not found");
      return;
    }
    const usersSnapshot = await get(usersRef);
    const users = usersSnapshot.val();

    if (!users) {
      console.error("Users not found");
      return;
    }

    Object.keys(displayedMessages).forEach((id) => {
      const messageElement = displayedMessages[id];
      if (messageElement) {
        container.removeChild(messageElement);
        delete displayedMessages[id];
      }
    });

    if (messages) {
      const sorted = Object.entries(messages).sort((a, b) => {
        return (b[1].pinned === true) - (a[1].pinned === true); // Pinned first
      });

      sorted.forEach(([id, message]) => {
        const messageUser = users[message.username];

        if (
          !message.shadowBanned ||
          (message.shadowBanned && message.username === currentUser.username) ||
          message.username === currentUser.username
        ) {
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
        }
      });
    }
  }

  onValue(messagesRef, (snapshot) => {
    if(isRemoving == true){
      return;
    }
    const messages = snapshot.val();
    updateDisplayedMessages(messages);
  });

  const usernameSelect = document.getElementById("usernameSelect");
  usernameSelect.addEventListener("change", async () => {
    const messagesSnapshot = await get(messagesRef);
    const messages = messagesSnapshot.val();
    updateDisplayedMessages(messages);
  });
}

function createMessageElement(id, message, container, displayedMessages) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.setAttribute("data-id", id);

  if (message.pinned) {
    messageDiv.classList.add("pinned");
    messageDiv.style.zIndex = "1000"; // Visually on top
  } else {
    messageDiv.style.zIndex = "1";
  }

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("contentContainer");

  const username = document.createElement("h4");
  username.textContent = message.username;

  const text = document.createElement("p");
  text.textContent = message.message;

  contentContainer.append(username, text);

  const removeButton = document.createElement("button");
  removeButton.textContent = "❌";
  removeButton.classList.add("removeButton");

  const pinButton = document.createElement("button");
  pinButton.textContent = "📌";
  pinButton.classList.add("pinButton");

  const likeButtonEl = document.createElement("button");
  likeButtonEl.textContent = "👍";
  likeButtonEl.id = "likeButton";

  const dislikeButtonEl = document.createElement("button");
  dislikeButtonEl.textContent = "👎";
  dislikeButtonEl.id = "dislikeButton";

  likeButtonEl.addEventListener("click", function () {
    likeButtonEl.classList.toggle("liked");
    dislikeButtonEl.classList.remove("disliked");
  });

  dislikeButtonEl.addEventListener("click", function () {
    dislikeButtonEl.classList.toggle("disliked");
    likeButtonEl.classList.remove("liked");
  });

  // 🔁 Toggle pin state in Firebase + UI
  pinButton.addEventListener("click", async () => {
    const newPinned = !message.pinned;
    const x = parseInt(messageDiv.style.left, 10);
    const y = parseInt(messageDiv.style.top, 10);

    let updates = {
      pinned: newPinned,
      x: newPinned ? x : null,
      y: newPinned ? y : null,
    };

    await update(ref(database, `messages/${id}`), updates);

    message.pinned = newPinned;
    pinButton.textContent = "📌";
    messageDiv.classList.toggle("pinned", newPinned);
    messageDiv.style.zIndex = newPinned ? "1000" : "1";
  });

  const color = message.color;
  messageDiv.style.borderColor = color;

  if (message._shadowBanned) {
    messageDiv.classList.add("shadowBanned");
  }


  messageDiv.append(
    contentContainer,
    removeButton,
    pinButton,
    likeButtonEl,
    dislikeButtonEl
  );

  removeButton.addEventListener("click", async () => {
    shake();  
    setTimeout(async () => {
      await removeMessageById(id); 
    }, 1000);
  });
  


function shake(){
  const allMessages = document.querySelectorAll(".message");
    allMessages.forEach((msg) => {
      const delay = Math.random() * 500;
      setTimeout(() => {
        msg.classList.add("shake");
        setTimeout(() => {
          msg.classList.remove("shake");
        }, 1000);
      }, delay);
    });
}

  // 📌 If pinned with saved position, use it
  if (
    message.pinned &&
    typeof message.x === "number" &&
    typeof message.y === "number"
  ) {
    messageDiv.style.position = "absolute";
    messageDiv.style.left = `${message.x}px`;
    messageDiv.style.top = `${message.y}px`;
    return messageDiv;
  }

  // 🔀 Otherwise, random positioning (non-pinned only)
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  container.appendChild(messageDiv);
  const actualMessageWidth = messageDiv.offsetWidth;
  const actualMessageHeight = messageDiv.offsetHeight;
  container.removeChild(messageDiv);

  let randomX, randomY, isOverlapping;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    randomX = Math.floor(Math.random() * (containerWidth - actualMessageWidth));
    randomY = Math.floor(
      Math.random() * (containerHeight - actualMessageHeight)
    );

    isOverlapping = Object.values(displayedMessages).some((existingMessage) => {
      if (existingMessage.classList.contains("pinned")) return false; // Skip pinned for overlap
      const existingX = parseInt(existingMessage.style.left, 10);
      const existingY = parseInt(existingMessage.style.top, 10);
      return (
        randomX < existingX + existingMessage.offsetWidth &&
        randomX + actualMessageWidth > existingX &&
        randomY < existingY + existingMessage.offsetHeight &&
        randomY + actualMessageHeight > existingY
      );
    });

    attempts++;
  } while (isOverlapping && attempts < maxAttempts);

  messageDiv.style.position = "absolute";
  messageDiv.style.left = `${randomX}px`;
  messageDiv.style.top = `${randomY}px`;

  return messageDiv;
}

// 🌀 Shuffle Button
const shuffleButton = document.getElementById("shuffleButton");
shuffleButton.addEventListener("click", shuffleMessages);
