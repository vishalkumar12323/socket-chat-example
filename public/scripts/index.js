const username = prompt("Please enter your profile name: ");
const socket = io({
    auth: {
        serverOffset: 0
    }
});

socket.emit("new_usr", username);

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const toggleBtn = document.getElementById('toggle-btn');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('message', input.value);
        input.value = "";
    }
})

socket.on("chat_msg", (msg, serverOffset) => {
    console.log("User Received Msg:: ", { msg });
    const messageList = document.createElement('li');
    messageList.textContent = msg;
    messages.appendChild(messageList);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
});

socket.on("user_connect", (data) => {
    if (socket.id !== data.id) {
        console.log(`user ${data.username} joined, userId: ${data.id}`);
    }
});

toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
        toggleBtn.textContent = "Connect";
        socket.disconnect();
    } else {
        toggleBtn.textContent = "Disconnect";
        socket.connect();
    }
})