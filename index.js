import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";


const db = await open({
    filename: 'chat.db',
    dirname: sqlite3.Database
});


await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_offset TEXT UNIQUE,
            content TEXT
        );
    `)

const port = Number(process.env.PORT) || 3001;
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {}
})

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});


io.on('connection', (socket) => {
    console.log(`A new user connected:: ${socket.id}`);

    socket.on('message', async (msg) => {
        let result;
        try {
            result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
        } catch (err) {
            console.log("MSG INSERT ERR:: ", err);
            return;
        }
        io.emit("chat_msg", msg, result.lastID);

        // socket.broadcast.emit("chat_msg", data);
    });



    socket.on('disconnect', () => {
        console.log(`User disconnected:: ${socket.id}`);
    });
});

server.listen(port, () => console.log(`Express + Socket.io server running on port: ${port}`));