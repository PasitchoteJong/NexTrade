import { prisma } from "../lib/prisma.js";
import fs from "fs";

const stocks = await prisma.stock.findMany({
    where:{
        isActive:true
    }
});

fs.writeFileSync(
    "./prisma/seed/stocks.json",
    JSON.stringify(stocks, null, 2)
);

console.log("Export stock success");

process.exit();