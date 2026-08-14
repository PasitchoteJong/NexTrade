import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";


export async function buyStockService(userId, stockId, quantity, price) {
  return await prisma.$transaction(async (tx) => {

    const totalPrice = new Prisma.Decimal(price).mul(quantity)

    // find wallet
    const haveWallet = await tx.wallet.findUnique({
      where: { userId }
    })
    if (!haveWallet) {
      throw createHttpError(400, 'You dont have wallet, Please create wallet')
    }

    const updateWallet = await tx.wallet.updateMany({
      where: {
        userId,
        balance: {
          gte: totalPrice
        }
      },
      data: {
        balance: {
          decrement: totalPrice
        }
      }
    })

    if (updateWallet.count !== 1) {
      throw createHttpError(400, 'Update wallet encountered a problem.')
    }

    const holding = await tx.holdingstock.findUnique({
      where: {
        userId_stockId: { userId, stockId }
      }
    })

    let updateHolding;

    if (holding) {
      const oldQuantity = holding.quantity;
      const oldAvgPrice = holding.avgPrice;
      const buyTotalPrice = totalPrice;

      const oldTotalValue = oldAvgPrice.mul(oldQuantity);
      const totalQuantity = oldQuantity + quantity;

      const avgPrice = oldTotalValue
        .add(buyTotalPrice)
        .div(totalQuantity);

      updateHolding = await tx.holdingstock.update({
        where: {
          id: holding.id
        },
        data: {
          quantity: totalQuantity,
          avgPrice
        }
      })

    } else {
      updateHolding = await tx.holdingstock.create({
        data: {
          userId,
          stockId,
          quantity,
          avgPrice: price
        }
      });
    }

    const createTransaction = await tx.transaction.create({
      data: {
        userId,
        stockId,
        type: "BUY",
        quantity,
        price,
        totalPrice
      }
    })

    return {
      updateWallet,
      updateHolding,
      createTransaction
    }
  })
}


export async function sellStockService(userId, stockId, quantity, price) {
  return await prisma.$transaction(async (tx) => {

    const wallet = await tx.wallet.findUnique({
      where: {
        userId
      }
    });
    if (!wallet) {
      throw createHttpError(400, 'You not have a wallet')
    }

    const totalPrice = new Prisma.Decimal(price).mul(quantity)

    const holding = await tx.holdingstock.findUnique({
      where: {
        userId_stockId: { userId, stockId }
      }
    })

    if (!holding) {
      throw createHttpError(400, 'You do not own this stock')
    }
    if (holding.quantity < quantity) {
      throw createHttpError(400, 'Your stock is not enough')
    }

    let updateHolding;
    const totalQuantity = holding.quantity - quantity;
    if (totalQuantity === 0) {
      updateHolding = await tx.holdingstock.delete({
        where: {
          id: holding.id
        }
      });
    } else {
      updateHolding = await tx.holdingstock.update({
        where: {
          id: holding.id
        },
        data: {
          quantity: totalQuantity
        }
      })
    }


    const updateWallet = await tx.wallet.update({
      where: {
        userId
      },
      data: {
        balance: {
          increment: totalPrice
        }
      }
    })

    const createTransaction = await tx.transaction.create({
      data: {
        userId,
        stockId,
        type: "SELL",
        quantity,
        price,
        totalPrice
      }
    })

    return {
      updateWallet,
      updateHolding,
      createTransaction
    }


  })
}

export async function getPortfolioService(userId) {
  const portfolio = await prisma.holdingstock.findMany({
    where: {
      userId
    }, include: {
      stock: true
    },
    orderBy: {
      stock: {
        symbol: 'asc'
      }
    }
  })
  return portfolio.map(item => ({
    symbol: item.stock.symbol,
    companyName: item.stock.companyName,
    logo: item.stock.logo,
    currency: item.stock.currency,
    quantity: item.stock.quantity,
    avgPrice: item.avgPrice
  }));
}