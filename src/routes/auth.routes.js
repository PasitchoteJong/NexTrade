import { Router } from 'express'
import { getMe, login, register } from '../controllers/auth.controller.js'
import authenticateMiddleware from '../middleware/authenticate.middleware.js'

const authRoute = Router()

authRoute.post('/register', register)
authRoute.post('/login', login)
authRoute.get('/me',authenticateMiddleware, getMe)

export default authRoute