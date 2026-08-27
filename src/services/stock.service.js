import { prisma } from "../lib/prisma.js"

export const getStockBy = (column, value) => {
    return prisma.stock.findFirst({
        where: {
            [column]: value,
            isActive: true
        }
    })
}

export const getStockByForSwith = (column, value) => {
    return prisma.stock.findFirst({
        where: {
            [column]: value
        }
    })
}



// { symbol, companyName, exchange, sector, industry }
export const createStockBySymbol = (stockData) => {
    return prisma.stock.create({
        data: stockData,
    })
}

export const getstocks = (search) => {
    return prisma.stock.findMany({
        where: {
            isActive: true,
            ...(search && {
                OR: [
                    { symbol: { contains: search } },
                    { companyName: { contains: search } }//,
                    // { exchange: { contains: search } },
                    // { currency: { contains: search } },

                ]
            })
        },
        select: {
            symbol: true,
            companyName: true,
            exchange: true,
            currency: true,
            logo: true,
            industry: true
        }
    })
}


export const patchStockById = (id, value) => {
    const { companyName, exchange, currency, industry } = value;
    return prisma.stock.update({
        where: { id },
        data: {
            companyName,
            exchange,
            currency,
            industry,
            isActive: true
        }

    })
}

export const updateStockStatusById = (id, status) => {
    return prisma.stock.update({
        where: { id },
        data: { isActive: status }
    })
}

export const importStock = (stockData) => {
    return prisma.stock.upsert({
        where: {
            symbol: stockData.symbol
        },
        update: {
            companyName: stockData.companyName,
            exchange: stockData.exchange,
            currency: stockData.currency,
            logo: stockData.logo,
            industry: stockData.industry
        },
        create: {
            ...stockData
        }
    })
}

export const addFavStockService = (userId, stockId) => {
    return prisma.favoriteStock.create({
        data: {
            userId: userId,
            stockId: stockId
        }
    })
}

export const checkFavStock = (userId, stockId) => {
    return prisma.favoriteStock.findUnique({
        where: {
            userId_stockId: {
                userId: userId,
                stockId: stockId
            }
        }
    })
}

export const removeFavStockService = (userId, stockId) => {
    return prisma.favoriteStock.delete({
        where: {
            userId_stockId: {
                userId: userId,
                stockId: stockId
            }
        }
    })
}