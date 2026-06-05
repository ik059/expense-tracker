import { Router, Request, Response} from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

const router = Router()
const userRepository = AppDataSource.getRepository(User);

router.post('/', async (req: Request, res: Response): Promise<void> =>{
    try{
        const { name, email, password } = req.body;

        const existUser = await userRepository.findOne({where:{email}})

        if(existUser){
            res.status(400).json({message: "User already registered!"})
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User()

        user.name = name;
        user.email = email;
        user.password = hashedPassword;

        await userRepository.save(user)

        res.status(201).json({
            message: "user created successfully",
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
})

export default router;