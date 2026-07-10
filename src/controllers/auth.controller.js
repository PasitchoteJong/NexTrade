import createHttpError from "http-errors"
import { prisma } from "../lib/prisma.js";
import { registerSchema } from "../validations/schema.js";

export async function register(req, res, next){
    //const { firstName, lastName, email, mobile, password, confirmPassword } = req.body
    // console.log(req.body)
    const data = await registerSchema.parseAsync(req.body)

    // if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()) {
    //     return next(createHttpError[400]('fill all inputs'))
    // }
    // if (confirmPassword !== password) {
    //     return next(createHttpError[400]('check confirm-password'))
    // }
    const haveUser = await prisma.user.findUnique({
        where: { email: data.email }
    })
    if (haveUser) {
        return next(createHttpError[409]('email is already registered.'))
    }
    // const newUser = {
    //     email: data.email,
    //     password: await bcrypt.hash(data.password, 10),
    //     firstName: data.firstName,
    //     lastName: data.lastName,
    //     mobile: data.mobile
    // }
    const result = await prisma.user.create({ data: data })
    res.json({
        message: 'Register Successful',
        result : result
    })

}

export function login(req, res) {
    res.send({
        message: 'Login Controller',
        body: req.body
    })
}

export function getMe(req, res) {
    res.send('Get me Controller')
}