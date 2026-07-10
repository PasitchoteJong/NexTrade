import { ZodError } from "zod"

export default function (err,req,res,next){
    if(err.name === 'TokenExpriedError'){
        return res.status(401).json({
            error: 'Token Expried',
            message: 'Your session has expired. Please log in again.'
        });
    }
    if(err.name === 'JsonWebTokenError'){
        return res.status(401).json({
            error: 'Invalid Token',
            message: 'Theprovide is invalid or malformed.'
        });
    }

    // if(err instanceof ZodError){
    //     console.log(err.flatten())
    //     return res.status(400).json({
    //         message: 'Validation Error',
    //         errors: err.flatten().fieldErrors
    //     })
    // }
    // console.error(err)
    // res.status(err.status || 500)
    // res.json({
    //     status : err.status || 500,
    //     message : err.message || 'Server Error'
    // })
}