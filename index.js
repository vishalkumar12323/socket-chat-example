import express from "express";
import { createServer } from "node:http";
import path, { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { pool } from "./database.js"


const port = Number(process.env.PORT) || 3001;
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, "public")));
const server = createServer(app);

const io = new Server(server, {
    connectionStateRecovery: {}
})

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});


io.on('connection', async (socket) => {

    socket.on("new_usr", (username) => {
        io.emit("user_connect", { username, id: socket.id });
    })

    socket.on('message', async (msg) => {

        let result;
        try {
            result = await pool.query('INSERT INTO messages (content) VALUES ($1) RETURNING id;', [msg]);
        } catch (err) {
            console.log("MSG INSERT ERR:: ", err);
            return;
        }
        io.emit("chat_msg", msg, result.rows[0].id);

        // socket.broadcast.emit("chat_msg", data);
    });

    if (!socket.recovered) {
        try {
            const result = await pool.query(`SELECT id, content FROM messages WHERE id = 
                $1;`, [socket.handshake.auth.serverOffset]);

            if (result.rows.length === 0) return;
            socket.emit('chat_msg', result.rows[0].content, result.rows[0].id);
        } catch (err) {
            console.log("Error::: ", err)
        }
    }

    socket.on('disconnect', () => {
        console.log(`User disconnected:: ${socket.id}`);
    });
});

server.listen(port, () => console.log(`Express + Socket.io server running on port: ${port}`));