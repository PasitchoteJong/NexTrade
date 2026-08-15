import express from 'express';
import createHttpError from 'http-errors'
import authRoute from './routes/auth.routes.js';
import walletRoute from './routes/wallet.route.js';
import stockRoute from './routes/stock.routes.js'
import marketRoute from './routes/market.routes.js'
import errorMiddleware from './middleware/error.middleware.js';
import candleRoute from './routes/candle.routes.js';
import tradeRoute from './routes/trade.routes.js';
import transacntionRoutes from './routes/transaction.routes.js';



const app = express()
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/wallet', walletRoute)
app.use('/api/stock', stockRoute)
app.use('/api/market', marketRoute)
app.use('/api/candle', candleRoute)
app.use('/api/trade', tradeRoute)
app.use('/api/transaction', transacntionRoutes)
//app.use('/api/comment', (req, res) => { res.send('comment service') })
//app.use('/api/like', (req, res) => { res.send('like service') })

app.use((req, res, next) => {
    return next(createHttpError.NotFound())
})

// app.use((err, req, res, next) => {
//     console.error(err)
//     res.status(err.status || 500)
//     res.json({
//         status: err.status || 500,
//         message: err.message || 'Internal Server Error'
//     })
// })
app.use(errorMiddleware)

export default app