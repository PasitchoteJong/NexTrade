import { Router } from "express"
import {
    buyStock,
    sellStock,
    getPortfolio
} from "../controllers/trade.controller.js"
import authenticateMiddleware from "../middleware/authenticate.middleware.js"



const tradeRoute = Router()

tradeRoute.post('/buy', authenticateMiddleware, buyStock)
tradeRoute.post('/sell', authenticateMiddleware, sellStock)
tradeRoute.get('/portfolio', authenticateMiddleware, getPortfolio)

export default tradeRoute