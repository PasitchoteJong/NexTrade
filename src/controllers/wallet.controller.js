import createHttpError from "http-errors"
import { getMe } from "./auth.controller.js"
import {
    createDepositTransition,
    createWallet,
    createWithdrawTransition,
    getWalletBy
} from "../services/wallet.service.js"
import { walletSchema } from "../validations/schema.js"

export async function walletCreate(req, res, next) {
    try{
        //const haveWallet = await getWalletBy('')

    const data = req.user;
    // console.log('wallet_controller',data)


    const haveWallet = await getWalletBy('userId', data.id)
    if (haveWallet) {
        return next(createHttpError[400]('Wallet already exists'))
    }

    const result = await createWallet(data)

    // return res.status(201).json({message: "Wallet created successfully"})
    res.status(201).json({
        message: 'Wallet Created Successfully',
        result: result
    });
    }catch(error){
        next(error);
    }
}

export async function walletDeposit(req, res, next) {
    try{
        const data = req.user;
    // console.log('This data in controller:', data)

    const { amount, bookbankId, bankName } = walletSchema.parse(req.body);
    // console.log('This after wallet schema parse',bookbankId)

    const haveWallet = await getWalletBy('userId', data.id)
    // console.log('This havewallet in controller', haveWallet)

    if (!haveWallet) {
        return next(createHttpError(400,'You dont have wallet, Please create wallet'))
    }

    // const deposit_min = 1000;
    // const deposit_max = 100000;
    // if (!amount || amount < deposit_min || amount > deposit_max) {
    //     return next(createHttpError[400]('Invalid deposit amount'))
    // }

    const result = await createDepositTransition(haveWallet.id, {
        amount,
        bookbankId,
        bankName
    })

    res.status(200).json({
        message: 'Deposit completed success',
        data: result
    });
    }catch(error){
        next(error);
    }
}

export async function walletWithdraw(req, res, next) {
    try{
        const data = req.user
    // console.log('This data in controller', data)

    const { amount, bookbankId, bankName } = walletSchema.parse(req.body);

    const haveWallet = await getWalletBy('userId', data.id)
    // console.log('This havewallet in controller', haveWallet)

    if (!haveWallet) {
        return next(createHttpError[400]('You dont have wallet, Please create wallet'))
    }


    //const currentBalance = Number(haveWallet.balance)
    if (haveWallet.balance < amount) {
        return next(createHttpError(400, `The Wallet isnot enough. Your current balance is ${haveWallet.balance.toLocaleString()} Baht.`))
    }
    // const deposit_min = 1000;
    // const deposit_max = 100000;
    // if (!amount || amount < deposit_min || amount > deposit_max) {
    //     return next(createHttpError[400]('Invalid deposit amount'))
    // }

    const result = await createWithdrawTransition(haveWallet.id, {
        amount,
        bookbankId,
        bankName
    })

    res.status(200).json({
        message: 'Deposit completed success',
        data: result
    });
    }catch(error){
        next(error);
    }
}



export async function walletById(req, res, next) {
    try{
        const user = req.user;
    const { id } = req.params;
    //console.log('id',id)

    const wallet = await getWalletBy('id', id)

    if (!wallet) {
        return next(createHttpError[404]('You dont have wallet, Please create wallet'))
    }
    if (wallet.userId !== user.id) {
        return next(createHttpError(403, 'This wallet isnot yours.'))
    }

    return res.status(200).json({
        data: {
            walletId: wallet.id,
            balance: wallet.balance
        }
    });
    }catch(error){
        next(error);
    }
}