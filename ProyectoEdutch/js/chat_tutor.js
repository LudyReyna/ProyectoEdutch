document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("messageInput");
  const messages = document.getElementById("messages");

  if (input.value.trim() !== "") {
    const newMsg = document.createElement("div");
    newMsg.classList.add("message", "sent");
    newMsg.textContent = input.value.trim();
    messages.appendChild(newMsg);
    input.value = "";

    messages.scrollTop = messages.scrollHeight; // autoscroll
  }
});