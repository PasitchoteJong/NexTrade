import dotenv from "dotenv";
import app from "./app.js";
import shutdown from "./utils/shutdown.util.js";
import http from "http";
import { Server } from "socket.io";
import { marketSocket } from "./socket/market.socket.js"


dotenv.config()


const PORT = process.env.PORT || 8000;

// console.log(process.env.FINNHUB_KEY);

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("Client Conneted:", socket.id);

    marketSocket(io, socket);

    socket.on("disconnect", () => {
        console.log("Client Disconnected:", socket.id);
    })
})

process.on('SIGINT', () => shutdown('SIGINT')); //Ctrl+C
process.on('SIGTERM', () => shutdown('SIGTERM')); //kill command or Docker

process.on('uncaughtException', () => shutdown('uncaughtException'))
process.on('uncaughtRejection', () => shutdown('uncaughtRejection'))

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
//app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))
