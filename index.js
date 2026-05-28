import express from "express";
import { createServer } from "node:http";


const port = Number(process.env.PORT) || 3001;
const app = express();

const server = createServer(app);

app.get("/", (req, res) => {
    res.send(`<h1> Hello World! </h1>`);
});

server.listen(port, () => console.log(`Express + Socket.io server running on port: ${port}`));