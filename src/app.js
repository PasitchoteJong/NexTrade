import express from 'express';
import authRoute from './routes/auth.routes.js';


const app = express()
app.use(express.json())

app.use('/api/auth', authRoute)
app.use('/api/post', (req, res) => { res.send('post service') })
app.use('/api/comment', (req, res) => { res.send('comment service') })
app.use('/api/like', (req, res) => { res.send('like service') })

app.use((req,res)=>{
    return next(createHttpError.NotFound())
})

app.use((err,req,res,next)=>{
    console.error(err)
    res.status(err.status || 500)
    res.json({
        status: err.status || 500,
        message: err.message || 'Internal Server Error'
    })
})


export default app