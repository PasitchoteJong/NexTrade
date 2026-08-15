import { create } from "axios";
import { prisma } from "../lib/prisma.js"

export async function getTransactionService(userId) {
    const transaction = await prisma.transaction.findMany({
        where: {
            userId
        },
        include: {
            stock: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


    return transaction.map(item => ({
        id: item.id,

        type: item.type,

        symbol:item.stock.symbol,
        companyName:item.stock.companyName,
        logo:item.stock.logo,

        quantity:item.quantity,

        price:item.price,
        totalPrice:item.totalPrice,

        createdAt : item.createdAt
    }));
}