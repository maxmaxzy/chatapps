const socket = io();

// Ambil room dari URL
const urlParams = new URLSearchParams(window.location.search);
let room = urlParams.get('room');

if(!room){
    room = prompt("Masukkan nama room:");
}

socket.emit("joinRoom", room);

function sendMessage(){
    const username = document.getElementById("username").value;
    const text = document.getElementById("messageInput").value;

    if(!username || !text) return;

    socket.emit("chatMessage", {
        room: room,
        username: username,
        text: text,
        time: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        })
    });

    document.getElementById("messageInput").value = "";
}

socket.on("message", (data) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");

    const currentUser = document.getElementById("username").value;

    if(data.username === currentUser){
        msgDiv.classList.add("sent");
    } else {
        msgDiv.classList.add("received");
    }

    msgDiv.innerHTML = `
        <strong>${data.username}</strong><br>
        ${data.text}
        <div class="timestamp">${data.time}</div>
    `;

    const container = document.getElementById("messages");
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
});

document.getElementById("messageInput")
.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});
