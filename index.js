import express from "express";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url"


const port = Number(process.env.PORT) || 3001;
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = createServer(app);

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

server.listen(port, () => console.log(`Express + Socket.io server running on port: ${port}`));