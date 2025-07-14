document.addEventListener("DOMContentLoaded", () => {

const socket = io();
socket.emit("register", USER_EMAIL);
const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

sendBtn.addEventListener("click", () => {
    const msg = input.value.trim();
    if (!msg) return;

    socket.emit("chatMessage", {
        sender:USER_EMAIL,
        receiver:SELECTED_USER_EMAIL,
        text:msg,
    });
     
    input.value = "";
});
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

socket.on("message", ({ user,text, time }) => {
    const msgDiv = document.createElement("div");
    msgDiv.className = user === "isMe" ? "message my_msg" : "message friend_msg";
    msgDiv.innerHTML = `<p>${text}<br><span>${time}</span></p>`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function deleteMessage(id) {
  socket.emit('deleteMessage', id);
}

function forwardMessage(id) {
  const msg = document.querySelector(`[data-id="${id}"] p`).innerText.split("\n")[0];
  input.value = msg;
}


document.querySelector(".search_chat input").addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase();
  document.querySelectorAll(".chatlist .block").forEach(block => {
    const name = block.querySelector("h4").innerText.toLowerCase();
    block.style.display = name.includes(search) ? "flex" : "none";
  });
});
});
