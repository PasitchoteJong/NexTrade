import { Router } from "express"
import authenticateMiddleware from "../middleware/authenticate.middleware.js"
import {
    patchStock,
    softDeleteStock,
    stockCreate,
    searchStocks,
    getStockBySymbol,
    importFinnhub
} from "../controllers/stock.controller.js"


const stockRoute = Router()

stockRoute.post('/stockCreate', authenticateMiddleware, stockCreate)
stockRoute.get('/stocks', authenticateMiddleware, searchStocks)
stockRoute.get('/stocks/import', authenticateMiddleware, importFinnhub)
stockRoute.get('/stocks/:symbol', authenticateMiddleware, getStockBySymbol)
stockRoute.patch('/stocks/:id', authenticateMiddleware, patchStock)
stockRoute.patch('/stocks/:id/status', authenticateMiddleware, softDeleteStock)

export default stockRoute