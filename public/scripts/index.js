const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const toggleBtn = document.getElementById('toggle-btn');




const username = prompt("Enter a nickname for chat:")?.trim() || `User-${Math.floor(Math.random() * 1000)}`;
const socket = io({
    auth: {
        serverOffset: 0
    }
});

socket.emit("new_usr", username);



form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input.value) return;

    const myMessage = document.createElement('li');
    myMessage.textContent = `${username}: ${input.value}`;
    messages.appendChild(myMessage);
    window.scrollTo(0, document.body.scrollHeight);

    socket.emit('message', input.value, (serverOffset) => {
        if (serverOffset != null) {
            socket.auth.serverOffset = serverOffset;
        }
    });

    input.value = "";
})

socket.on("chat_msg", (message, serverOffset) => {
    console.log("User Received Msg:: ", message);
    const messageList = document.createElement('li');
    const sender = message.username || 'Anonymous';
    messageList.textContent = `${sender}: ${message.content}`;
    messages.appendChild(messageList);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
});

socket.on("user_connect", (data) => {
    if (socket.id !== data.id) {

        const popups = document.getElementById('popups');
        if (!popups) return;

        const notification = document.createElement('div');
        notification.className = 'notification show';

        const text = document.createElement('span');
        text.textContent = `${data.username} joined the chat`;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Close notification');
        closeBtn.textContent = '×';

        closeBtn.addEventListener('click', () => {
            hideAndRemove(notification);
        });

        notification.appendChild(text);
        notification.appendChild(closeBtn);
        popups.appendChild(notification);


        const AUTO_HIDE_MS = 3500;
        const timer = setTimeout(() => hideAndRemove(notification), AUTO_HIDE_MS);


        function hideAndRemove(el) {
            if (!el) return;
            el.classList.add('hide');

            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
            }, 300);
            clearTimeout(timer);
        }
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


