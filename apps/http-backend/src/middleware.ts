import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/config";

export const authMiddleware = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const token = req.headers["authorization"] ?? ""
        const decoded = jwt.verify(token, JWT_SECRET)

        if(decoded){
            req.userId = (decoded as JwtPayload)?.userId
            next()
        }
        else {
            res.status(403).json({
                message: "Unauthorized",
                success: false
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Sever Error",
            success: false
        })
    }
}