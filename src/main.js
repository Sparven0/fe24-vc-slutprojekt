import { displayMessages } from "./js/displayMessage.js";
import { setupMessageSearch } from "./js/searchMessages.js";

// Funktion för att växla mellan mörkt och ljust läge
const darkModeToggle = document.getElementById('dark-mode-toggle');


if (localStorage.getItem('dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

 
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('dark-mode', 'true');
  } else {
    localStorage.setItem('dark-mode', 'false');
  }
});

  

displayMessages("messagesContainer");

// Initialize search functionality
setupMessageSearch();
