import { Router } from "express"
import authenticateMiddleware from "../middleware/authenticate.middleware.js"
import {
    quote
} from "../controllers/market.controller.js"

const marketRoute = Router()

marketRoute.get('/quote/:symbol', authenticateMiddleware, quote)


export default marketRoute