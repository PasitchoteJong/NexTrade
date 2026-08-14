import { Router } from "express"
import authenticateMiddleware from "../middleware/authenticate.middleware.js"
import {
    getCandle,
    importHistorical
} from "../controllers/candle.controller.js"

const candleRoute = Router()


candleRoute.get('/importhistorical/:symbol', authenticateMiddleware, importHistorical)
candleRoute.get('/getcandle/:symbol', authenticateMiddleware, getCandle)

export default candleRoute