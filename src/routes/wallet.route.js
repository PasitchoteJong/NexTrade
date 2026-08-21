import { Router } from "express"
import authenticateMiddleware from "../middleware/authenticate.middleware.js"
import {
    getMyWallet,
    walletCreate,
    walletDeposit,
    walletHistory,
    walletWithdraw
} from "../controllers/wallet.controller.js"

const walletRoute = Router()

walletRoute.post('/walletCreate', authenticateMiddleware, walletCreate)
walletRoute.post('/deposit', authenticateMiddleware, walletDeposit)
walletRoute.post('/withdraw', authenticateMiddleware, walletWithdraw)
walletRoute.get('/myWallet', authenticateMiddleware, getMyWallet)
walletRoute.get('/history', authenticateMiddleware, walletHistory)

export default walletRoute