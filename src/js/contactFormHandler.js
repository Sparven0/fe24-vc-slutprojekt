document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    const confirmationMessage = document.getElementById("confirmationMessage");
    confirmationMessage.style.display = "block";

    this.reset();

    setTimeout(() => {
        confirmationMessage.style.display = "none";
    }, 5000);
});