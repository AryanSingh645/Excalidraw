import express from "express"
import jwt from "jsonwebtoken"
import { authMiddleware } from "./middleware"
import {JWT_SECRET} from "@repo/backend-common/config"
import {CreateUserSchema} from "@repo/common/types"

const app = express()

app.listen(3000)

app.post("/signup", async (req, res) => {
    // TODO: Db call for registering user
    const data = CreateUserSchema.safeParse(req.body)
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