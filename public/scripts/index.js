const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const toggleBtn = document.getElementById('toggle-btn');




// const username = prompt("Please enter your profile name: ");
const username = "vishal";
const socket = io({
    auth: {
        serverOffset: 0
    }
});

socket.emit("new_usr", username);



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
        // show a temporary popup notification for other users joining
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

        // auto hide after 3.5 seconds
        const AUTO_HIDE_MS = 3500;
        const timer = setTimeout(() => hideAndRemove(notification), AUTO_HIDE_MS);

        // helper to animate then remove
        function hideAndRemove(el) {
            if (!el) return;
            el.classList.add('hide');
            // wait for transition then remove
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


