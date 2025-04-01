export function shuffleMessages() {
  const container = document.getElementById('messagesContainer');
  const allMessages = document.querySelectorAll(".message");

  if (allMessages.length === 0) {
    console.log("No messages to shuffle.");
    return;
  }

  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  allMessages.forEach((message) => {
    // ⛔ Skip pinned messages
    if (message.classList.contains("pinned")) return;

    const messageWidth = message.offsetWidth;
    const messageHeight = message.offsetHeight;

    let randomX, randomY, isOverlapping;

    do {
      randomX = Math.floor(Math.random() * (containerWidth - messageWidth));
      randomY = Math.floor(Math.random() * (containerHeight - messageHeight));

      isOverlapping = false;
      allMessages.forEach((otherMessage) => {
        if (
          message !== otherMessage &&
          !otherMessage.classList.contains("pinned")
        ) {
          const otherX = parseInt(otherMessage.style.left, 10);
          const otherY = parseInt(otherMessage.style.top, 10);

          if (
            randomX < otherX + otherMessage.offsetWidth &&
            randomX + messageWidth > otherX &&
            randomY < otherY + otherMessage.offsetHeight &&
            randomY + messageHeight > otherY
          ) {
            isOverlapping = true;
          }
        }
      });
    } while (isOverlapping);

    message.style.position = "absolute";
    message.style.left = `${randomX}px`;
    message.style.top = `${randomY}px`;
  });
}