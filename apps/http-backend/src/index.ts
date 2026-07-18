import express from "express"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware"
import {JWT_SECRET} from "@repo/backend-common/config"
import {CreateRoomSchema, CreateUserSchema, SignInSchema} from "@repo/common/types"
import {prisma} from "@repo/db/client"
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser"

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    return res.status(201).json({
        message: "Server is running"
    })
})

app.post("/signup", async (req, res) => {
    try {
        const data = CreateUserSchema.safeParse(req.body)

        console.log("data", data);

        if(!data.success){
            console.log("Invalid data")
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
        console.log(error)
        return res.status(400).json({
            message: "User already exists",
            success: false
        })
    }
})

app.post("/signin", async (req, res) => {
    try {

        const parsedData = SignInSchema.safeParse(req.body)
        if(!parsedData.success){
            return res.status(400).json({
                message: "Invalid data",
                success: false
            })
        }
        
        const existingUser = await prisma.user.findUnique({
            where: {
                email: parsedData.data.email
            }
        })

        if(!existingUser){
            return res.status(404).json({
                message: "User does not exist.",
                success: false
            })
        }

        const isValidPassword = await bcrypt.compare(parsedData.data.password, existingUser.password)

        if(!isValidPassword){
            return res.status(400).json({
                message: "Wrong Password",
                success: false
            })
        }
        
        const token = jwt.sign({userId: existingUser.id}, JWT_SECRET);
    
        return res
            .cookie("token", token, {httpOnly: true, secure: false})
            .status(200)
            .json({
                message: "LoggedIn Successfully !!",
                success: true,
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while user login.",
            success: false
        })
    }
})

app.post("/room", authMiddleware, async (req, res) => {
    try {
        const parsedData = CreateRoomSchema.safeParse(req.body)
        if(!parsedData.success || !req.userId){
            return res.status(400).json({
                message: "Invalid",
                success: false
            })
        }

        const createRoom = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: req.userId
            }
        })

        return res.status(201).json({
            message: "Room created successfully",
            success: true,
            room: createRoom
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error while creating room.",
            success: false
        })
    }
})

app.listen(3001, () => {
    console.log("Sever Started on localhost:3001")
})
