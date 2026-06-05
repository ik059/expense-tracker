import { Router, Response, Request } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post('/login', async (req: Request, res: Response): Promise<void> =>{
    try{
        const { email, password } = req.body;

        const existUser = await userRepository.findOne({where:{email}})

        if(!existUser){
            res.status(400).json({message: "Invalid user or password"});
            return;
        }

        const isValidPassword = await bcrypt.compare(password, existUser.password)

        if(!isValidPassword){
            res.status(401).json({message:"Invalid email or password"});
            return;
        }

        const token = jwt.sign(
            {userId: existUser.id, email: existUser.email},
            process.env.JWT_SECRET as string,
            { expiresIn : '7d'}
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user:{
                id: existUser.id,
                email: existUser.email,
                name: existUser.name
            }
        })

    }
    catch(error){
        console.error(`Error in login ${error}`)
        res.status(500).json({message: "Internal server error"});
    }
})

export default router;