import createHttpError from "http-errors"
import { prisma } from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../validations/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { createUser, getUserByEmail } from "../services/user.service.js";

export async function register(req, res, next) {
    //const { firstName, lastName, email, mobile, password, confirmPassword } = req.body
    // console.log(req.body)
    const data = await registerSchema.parseAsync(req.body)

    // if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()) {
    //     return next(createHttpError[400]('fill all inputs'))
    // }
    // if (confirmPassword !== password) {
    //     return next(createHttpError[400]('check confirm-password'))
    // }

    const haveUser = await getUserByEmail(data.email)

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
    const result = await createUser(data)
    res.json({
        message: 'Register Successful',
        result: result
    })

}

export async function login(req, res, next) {
    const data = loginSchema.parse(req.body)

    const foundUser = await getUserByEmail(data.email)
    if (!foundUser) {
        return next(createHttpError[401]('Invalid login 1'))
    }

    let pwOk = await bcrypt.compare(data.password, foundUser.password)
    if (!pwOk) { return next(createHttpError[401]('Invalid login 2')) }

    const payload = { id: foundUser.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h'
    })

    const {password,createdAt, updateAt, ...userData} = foundUser
    res.json({
        message:'Login Successful',
        token: token,
        user: userData
    })
}

export function getMe(req, res) {
    res.send('Get me Controller')
}