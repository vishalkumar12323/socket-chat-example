const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const toggleBtn = document.getElementById('toggle-btn');
const typingIndicator = document.getElementById('typing-indicator');
const onlineUsersList = document.getElementById('online-users');

let typing = false;
let typingUsers = new Set();
let typingTimeout;
const TYPING_STOP_MS = 1200;

const username = prompt("Enter a nickname for chat:")?.trim() || `User-${Math.floor(Math.random() * 1000)}`;
const socket = io({
    auth: {
        serverOffset: 0
    }
});

socket.emit("new_usr", username);

// re-announce our username when (re)connected so server updates online list
socket.on('connect', () => {
    socket.emit('new_usr', username);
});

function updateTypingIndicator() {
    const names = Array.from(typingUsers);
    if (names.length === 0) {
        typingIndicator.textContent = '';
        return;
    }

    if (names.length === 1) {
        typingIndicator.textContent = `${names[0]} is typing...`;
        return;
    }

    if (names.length === 2) {
        typingIndicator.textContent = `${names[0]} and ${names[1]} are typing...`;
        return;
    }

    typingIndicator.textContent = `${names.slice(0, 2).join(', ')} and ${names.length - 2} more are typing...`;
}

function updateOnlineUsers(users) {
    onlineUsersList.innerHTML = users.map((name) => `<li>${name}</li>`).join('');
}

function sendTyping() {
    if (!typing) {
        typing = true;
        socket.emit('typing');
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(stopTyping, TYPING_STOP_MS);
}

function stopTyping() {
    if (!typing) return;
    typing = false;
    socket.emit('stop_typing');
}



form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!input.value) return;

    const myMessage = document.createElement('li');
    myMessage.textContent = `${username}: ${input.value}`;
    messages.appendChild(myMessage);
    window.scrollTo(0, document.body.scrollHeight);
    stopTyping();

    socket.emit('message', input.value, (serverOffset) => {
        if (serverOffset != null) {
            socket.auth.serverOffset = serverOffset;
        }
    });

    input.value = "";
})

input.addEventListener('input', () => {
    if (input.value.trim()) {
        sendTyping();
    } else {
        stopTyping();
    }
});

input.addEventListener('blur', () => {
    stopTyping();
});

socket.on("chat_msg", (message, serverOffset) => {
    console.log("User Received Msg:: ", message);
    const messageList = document.createElement('li');
    const sender = message.username || 'Anonymous';
    messageList.textContent = `${sender}: ${message.content}`;
    messages.appendChild(messageList);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
});

socket.on('user_typing', (data) => {
    typingUsers.add(data.username);
    updateTypingIndicator();
});

socket.on('user_stop_typing', (data) => {
    typingUsers.delete(data.username);
    updateTypingIndicator();
});

socket.on('user_list', (users) => {
    updateOnlineUsers(users);
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
        // remove ourselves from the local online list immediately
        Array.from(onlineUsersList.children).forEach((li) => {
            if (li.textContent === username) li.remove();
        });
        socket.disconnect();
    } else {
        toggleBtn.textContent = "Disconnect";
        socket.connect();
    }
})


