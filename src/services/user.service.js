import { prisma } from "../lib/prisma.js";

export const getUserByEmail = (value)=>{
    return prisma.user.findUnique({
        where: { email: value}
    })
}

export const createUser = (userData)=>{
    return prisma.user.create({data: userData})
}