import { prisma } from "../lib/prisma.js"

export const createCandles = (candles) => {

    console.log("Candle length:", candles.length);
    console.log(candles[0]);

    return prisma.stockcandle.createMany({
        data: candles
        // skipDuplicates:true
    });
};

export const getCandleBySymbol = (symbol) => {

    return prisma.stockcandle.findMany({
        where: {
            symbol
        },

        orderBy: {
            timestamp: "asc"
        }
    });

};