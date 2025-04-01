import { Message } from "./Message.js";
import { postMessage } from "./fetch.js";
import { Fireworks } from "fireworks-js";
import { profanityCheckAndPost } from "./fetch.js";
import {ref, push, set, get, onValue} from "firebase/database";
import { database } from "./firebase.js";

const messageForm = document.getElementById("messageForm");
const userForm = document.getElementById("userForm");
const usernameSelect = document.getElementById("usernameSelect");

if(!messageForm || !userForm || !usernameSelect) {
  console.error("One or more form elements not found");
}

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const newUsername = document.getElementById("newUsername").value;
  const newShadowbanned = document.getElementById("newShadowBanned").checked;

  if (!newUsername) {
    console.error("Username is required");
    return;
  }

  const userRef = ref(database, "users");
  const newUserRef = push(userRef);
  await set(newUserRef, {
    username: newUsername,
    shadowBanned: newShadowbanned,
  });

  alert(`User "${newUsername}" created successfully!`);
  loadUsers();
  userForm.reset();
});

async function loadUsers() {
  const usersRef = ref(database, "users");
  const snapshot = await get(usersRef);

  usernameSelect.innerHTML = "";
  if (snapshot.exists()) {
    const users = snapshot.val();
    Object.entries(users).forEach(([id, user]) => {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = user.username;
      usernameSelect.appendChild(option);
    });
  }
}

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const selectedUserId = usernameSelect.value;
  const messageText = document.getElementById("messageTxt").value;
  const color = createRandomColor();

  if (!selectedUserId || !messageText) {
    console.error("Username and message are required");
    return;
  }

  const userRef = ref(database, `users/${selectedUserId}`);
  const userSnapshot = await get(userRef);
  const user = userSnapshot.val();

  const messageObj = {
    username: user.username,
    message: messageText,
    color: color,
    shadowBanned: user.shadowBanned,
    pinned: false,
    x: null,
    y: null,
  };

  const msgProf = await profanityCheckAndPost(messageObj.message);
  if (msgProf.isProfanity === true) {
    console.error("Message contains profanity");
    alert("Message contains profanity");
    return;
  }

  try {
    const response = await postMessage(messageObj);
    if (response.success) {
      console.log("Message posted successfully:", response.id);

      const container = document.getElementById("messagesContainer");

      // 🎆 Fireworks
      const fireworksContainer = document.createElement("div");
      fireworksContainer.id = "fireworksContainer";
      Object.assign(fireworksContainer.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "9999",
      });
      container.appendChild(fireworksContainer);

      const isDarkMode = document.body.classList.contains("dark-mode");

      const fireworks = new Fireworks(fireworksContainer, {
        autoresize: true,
        opacity: isDarkMode ? 0.8 : 0.5,
        acceleration: 1.05,
        friction: 0.98,
        gravity: 1.5,
        particles: isDarkMode ? 200 : 150,
        trace: isDarkMode ? 5 : 3,
        explosion: isDarkMode ? 15 : 10,
        intensity: isDarkMode ? 80 : 50,
        flickering: 50,
        lineWidth: {
          trace: isDarkMode ? 3 : 2,
          explosion: isDarkMode ? 5 : 4,
        },
        brightness: {
          min: isDarkMode ? 70 : 50,
          max: isDarkMode ? 100 : 80,
          decay: { min: 0.015, max: 0.03 },
        },
        hue: { min: 0, max: 360 },
        delay: { min: 30, max: 60 },
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

loadUsers();

function createRandomColor() {
  const getRandomValue = () => Math.floor(Math.random() * 156) + 100;

  let red = getRandomValue();
  let green = getRandomValue();
  let blue = getRandomValue();

  const MIN_DIFF = 50;
  if (Math.abs(red - green) < MIN_DIFF) green = (green + 100) % 256;
  if (Math.abs(green - blue) < MIN_DIFF) blue = (blue + 100) % 256;
  if (Math.abs(blue - red) < MIN_DIFF) red = (red + 100) % 256;

  const rgbColor = `rgb(${red}, ${green}, ${blue})`;
  console.log(rgbColor);
  return rgbColor;
}
