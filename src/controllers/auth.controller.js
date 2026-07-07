import createHttpError from "http-errors"
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs"


export async function register(req, res, next) {
    const { firstName, lastName, email, mobile, password, confirmPassword } = req.body

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobile.trim() || !password.trim() || !confirmPassword.trim()) {
        return next(createHttpError[400]('fill all inputs'))
    }
    if (confirmPassword !== password) {
        return next(createHttpError[400]('check confirm-password'))
    }
    const haveUser = await prisma.user.findUnique({
        where: { email }
    })
    if (haveUser) {
        return next(createHttpError[409]('email is already registered.'))
    }
    const newUser = {
        email,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        mobile
    }
    const result = await prisma.user.create({ data: newUser })
    res.json({
        message: 'Register Successful',
        result
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