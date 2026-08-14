import { mapQuote } from "../mappers/market.mapper.js";
import { getQuote } from "../provider/finnhub/market.provider.js";

const subcriptions = {};

export function marketSocket(io, socket) {
    console.log("Market socket connected");

    // const symbol = "AAPL";

    // const interval = setInterval(async () => {
    //     try {
    //         const data = await getQuote(symbol);
    //         const quote = mapQuote(symbol, data)
    //         socket.emit("price:update", quote)
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }, 5000);

    socket.on("subscribe", (symbol) => {
        symbol = symbol.toUpperCase();
        console.log(socket.id, "subscribe", symbol);
        socket.join(symbol);

        if (!subcriptions[symbol]) {
            subcriptions[symbol] = setInterval(async () => {
                try {
                    const data = await getQuote(symbol);
                    const quote = mapQuote(symbol, data);

                    io.to(symbol)
                        .emit("price:update", quote);
                } catch (error) {
                    console.log(error.message);
                }
            }, 5000);
        }
    });

    // socket.on("disconnect", () => {
    //     clearInterval(interval)
    // })


    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });



}