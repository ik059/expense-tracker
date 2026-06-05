import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../models/Category';
import { User } from '../models/User';
import { protect, AuthRequest} from '../middleware/authMiddleware';

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);

router.post('/', protect, async( req: AuthRequest, res: Response):Promise<void> =>{
    try{
        const { name, description } = req.body;

        const user = await userRepository.findOne({
            where:{id: req.userId}
        });

        if(!user){
            res.status(404).json({message:"User not found"})
            return;
        };

        const category = new Category();

        category.name = name;
        category.description = description;
        category.user = user;

        await categoryRepository.save(category);

        res.status(201).json({
            message: "Category created successfully",
            category:{
                id: category.id,
                name: category.name,
                description: category.description
            }
        })
    }
    catch(error){
        console.error(`Error in creating category: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
})

router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> =>{
    try{
        console.log(req.userId)
        const categories = await categoryRepository.find({
            where:{user: {id: req.userId } }
        })

        res.status(200).json({categories})
    }
    catch(error){
        console.error(`Error is getting categories: ${error}`)
        res.status(500).json({message:"Internal server error"})
    }
})

export default router;