import { PrismaClient } from "../src/generated/prisma";
import stocks from "./seed/stocks.json" with {type: "json"};

const prisma = new PrismaClient();

async function main() {
    for (const stock of stocks) {
        await prisma.stock.upsert({
            where: {
                symbol: stock.symbol
            },
            update: {
                companyName: stock.companyName,
                exchange: stock.exchange,
                currency: stock.currency,
                logo: stock.logo,
                industry: stock.industry,
                isActive: stock.isActive
            },
            create:{
                symbol:stock.symbol,
                companyName:stock.companyName,
                exchange:stock.exchange,
                currency:stock.currency,
                logo:stock.logo,
                industry:stock.industry,
                isActive:stock.isActive
            }
        });
    }
    console.log("Seed stock complete");
}

main()
.catch(e=>{
    console.error(e);
    process.exit(1);
})
.finally(async()=>{
    await prisma.$disconnect();
})