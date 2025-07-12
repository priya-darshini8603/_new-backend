document.addEventListener("DOMContentLoaded", () => {
const socket = io();
const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

sendBtn.addEventListener("click", () => {
    const msg = input.value.trim();
    if (!msg) return;

    socket.emit("chatMessage", msg);
    input.value = "";
});

socket.on("message", ({ user, text, time }) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = user === "You" ? "message my_msg" : "message friend_msg";
    msgDiv.innerHTML = `<p>${text}<br><span>${time}</span></p>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
});
});
