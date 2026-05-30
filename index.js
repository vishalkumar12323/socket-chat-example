import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";


const port = Number(process.env.PORT) || 3001;
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = createServer(app);

const io = new Server(server)

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});


io.on('connection', (socket) => {
    console.log(`A new user connected:: ${socket.id}`);

    socket.on('message', (data) => {
        console.log(`message received:: ${data}`);
        io.emit("incoming_msg", data);

        // socket.broadcast.emit("incoming_msg", data);
    });



    socket.on('disconnect', () => {
        console.log(`User disconnected:: ${socket.id}`);
    });
});

server.listen(port, () => console.log(`Express + Socket.io server running on port: ${port}`));