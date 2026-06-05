import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
console.log("Auth middleware", process.env.JWT_SECRET)
export interface AuthRequest extends Request {
    userId? : string;
    email? : string;
}

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void =>{
    try{
       // console.log(req)
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({message: "No token provided"});
            return;
        }

        const token = authHeader.split(" ")[1]

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { userId: string, email: string };
        console.log(decoded)
        req.userId = decoded.userId;
        req.email = decoded.email

        next();
    }
    catch(error){
        console.error(`Error in auth middleware ${error}`)
        res.status(401).json({message: "Invalid or expired token!"})
    }
};