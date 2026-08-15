import { Router } from "express"
import authenticateMiddleware from '../middleware/authenticate.middleware.js'
import { getTransaction } from '../controllers/getTransaction.controller.js'

const transacntionRoutes = Router()

transacntionRoutes.get('/port', authenticateMiddleware, getTransaction)

export default transacntionRoutes