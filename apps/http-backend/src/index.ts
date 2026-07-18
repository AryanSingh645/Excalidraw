import express from "express"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware"
import {JWT_SECRET} from "@repo/backend-common/config"
import {CreateUserSchema} from "@repo/common/types"
import {prisma} from "@repo/db/client"
import bcrypt from "bcrypt"

const app = express()

app.listen(3000)

app.post("/signup", async (req, res) => {
    try {
        const data = CreateUserSchema.safeParse(req.body)

        if(!data.success){
            return res.status(400).json({
                message: "Invalid data",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(data.data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.data?.name,
                email: data.data.email,
                password: hashedPassword
            }
        })

        return res.status(201).json({
            message: "User Registered Successfully",
            success: true,
            user
        })
    } catch (error) {
        return res.status(400).json({
            message: "User already exists",
            success: false
        })
    }
})

app.post("/signin", async (req, res) => {
    try {
        const {username, password} = req.body
        if(!username || !password){
    
        }
        
        // TODO: db call here for verifying the user exists and password verification
        const userId = 1;
    
        const token = jwt.sign({userId}, JWT_SECRET);
    
        return res.status(200).json({
            message: "Registered Successfully!!",
            success: true,
            token
        })
    } catch (error) {
        
    }
})

app.post("/room", authMiddleware, async (req, res) => {

})