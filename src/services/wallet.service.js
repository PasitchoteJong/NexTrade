import { prisma } from "../lib/prisma.js";

export const getWalletBy = (column, value) => {
  return prisma.wallet.findFirst({
    where: { [column]: value }
  })
}

export const createWallet = (userData) => {

  return prisma.wallet.create({
    data: {
      user: {
        connect: {
          id: userData.id
        }
      }
    }
  })

}


export async function createDepositTransition(walletId, depositData) {
  const { amount, bookbankId, bankName } = depositData;

  return await prisma.$transaction(async (tx) => {

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: { increment: Number(amount) }
      }
    });

    const history = await tx.wallethistory.create({
      data: {
        amount: amount,
        bookbankId: bookbankId,
        bankName: bankName,
        walletId: walletId
      }
    });
    return {updatedWallet, history};
  });
}

export async function createWithdrawTransition(walletId, withdrawData) {
  const { amount, bookbankId, bankName } = withdrawData;

  return await prisma.$transaction(async (tx) => {

    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: {
        balance: { decrement: Number(amount) }
      }
    });

    const history = await tx.wallethistory.create({
      data: {
        amount: -Number(amount),
        bookbankId: bookbankId,
        bankName: bankName,
        walletId: walletId
      }
    });
    return {updatedWallet, history};
  });
}


