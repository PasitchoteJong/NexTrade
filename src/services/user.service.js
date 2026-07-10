import { prisma } from "../lib/prisma.js";

export const getUserBy = (column,value)=>{
    return prisma.user.findUnique({
        where: { [column]: value}
    })
}

export const createUser = (userData)=>{
    return prisma.user.create({data: userData})
}