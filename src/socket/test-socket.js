import { io } from "socket.io-client";

const socket = io('http://localhost:8801');

socket.on("connect", () => {
    console.log("Connect");
    console.log(socket.id);

    socket.emit(
        "subscribe",
        "AAPL"
    );
})


socket.on("price:update", (data) => {
    console.log("Price Update", data);
})

socket.on("disconnect", () => {
    console.log("Disconnected")
})