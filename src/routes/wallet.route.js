import { Router } from "express"
import authenticateMiddleware from "../middleware/authenticate.middleware.js"
import {
    walletById,
    walletCreate,
    walletDeposit,
    walletWithdraw
} from "../controllers/wallet.controller.js"

const walletRoute = Router()

walletRoute.post('/walletCreate', authenticateMiddleware, walletCreate)
walletRoute.post('/deposit', authenticateMiddleware, walletDeposit)
walletRoute.post('/withdraw', authenticateMiddleware, walletWithdraw)
walletRoute.get('/walletbyid/:id', authenticateMiddleware, walletById)
//walletRoute.get('/wallethistory',)

export default walletRoute