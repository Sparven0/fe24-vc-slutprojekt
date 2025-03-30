export function shuffleMessages() {
    const container = document.getElementById('messagesContainer');
    const allMessages = document.querySelectorAll(".message"); // Select all messages
  
    if (allMessages.length === 0) {
      console.log("No messages to shuffle.");
      return;
    }
  
    // Get the container size
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
  
    // Loop through each message and reassign random positions
    allMessages.forEach((message) => {
      const messageWidth = message.offsetWidth;
      const messageHeight = message.offsetHeight;
  
      let randomX, randomY, isOverlapping;
  
      do {
        // Randomize new position
        randomX = Math.floor(Math.random() * (containerWidth - messageWidth));
        randomY = Math.floor(Math.random() * (containerHeight - messageHeight));
  
        // Check if the new position overlaps with any existing message
        isOverlapping = false;
        allMessages.forEach((otherMessage) => {
          if (message !== otherMessage) { // Skip the current message
            const otherMessageX = parseInt(otherMessage.style.left, 10);
            const otherMessageY = parseInt(otherMessage.style.top, 10);
  
            if (
              randomX < otherMessageX + otherMessage.offsetWidth &&
              randomX + messageWidth > otherMessageX &&
              randomY < otherMessageY + otherMessage.offsetHeight &&
              randomY + messageHeight > otherMessageY
            ) {
              isOverlapping = true; // There is overlap
            }
          }
        });
      } while (isOverlapping); // Retry until no overlap is found
  
      // Apply the new position
      message.style.position = "absolute";
      message.style.left = `${randomX}px`;
      message.style.top = `${randomY}px`;
    });
  }