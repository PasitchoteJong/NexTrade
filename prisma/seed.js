import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import stocks from "./seed/stocks.json" with {type: "json"};
import stockcandle from "./seed/stockcandle.json" with{type:"json"}

// console.log({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     database: process.env.DATABASE_NAME,
//     url:process.env.DATABASE_URL
// });

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    allowPublicKeyRetrieval: true
});



const prisma = new PrismaClient({
    adapter
});

async function main() {
    const stockData = stocks.map(e=>({
        symbol:e.symbol,
        companyName:e.companyName,
        exchange:e.exchange,
        currency:e.currency,
        logo:e.logo,
        industry:e.industry,
        isActive:e.isActive,
        createdAt:e.createdAt
    }));

    await prisma.stock.createMany({
        data:stockData,
        skipDuplicates:true
    });

    const stockcandleData = stockcandle.map(e=>({
        symbol:e.symbol,
        open:e.open,
        high:e.high,
        low:e.low,
        close:e.close,
        volume:e.volume,
        timestamp:new Date(e.timestamp)
    }))
    await prisma.stockcandle.createMany({
        data:stockcandleData,
        skipDuplicates:true
    })
}

main()
.catch(e=>{
    console.error(e);
    process.exit(1);
})
.finally(async()=>{
    await prisma.$disconnect();
})