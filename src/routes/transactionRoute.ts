import { Router, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Transaction, TranscationType } from '../models/Transaction';
import { protect, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);
const transactionRespository = AppDataSource.getRepository(Transaction);

router.post('/', protect, async (req: AuthRequest, res: Response):Promise<void> =>{
    try{
        const { title, amount, type, note, categoryId } = req.body

        const user = await userRepository.findOne({
            where:{id: req.userId}
        })

        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }

        const category = await categoryRepository.findOne({
            where:{
                user:{id:req.userId},
                id: categoryId
            }
        })

        if(!category){
            res.status(404).json({message:"category not found!"})
            return;
        }

        if(!Object.values(TranscationType).includes(type)){
            res.status(400).json({message:"Type must be income or expense"})
        }

        const transaction = new Transaction();

        transaction.title = title;
        transaction.amount = amount;
        transaction.type = type;
        transaction.note = note;
        transaction.user = user;
        transaction.category = category;

        await transactionRespository.save(transaction);

        res.status(201).json({
            message: "Transaction created successfully",
            transaction:{
                id: transaction.id,
                title: transaction.title,
                amount: transaction.amount,
                type: transaction.type,
                note: transaction.note,
                category: category.name,
                createdAt: transaction.createdAt
            }
        })
    }
    catch(error){
        console.error(`Error is create transaction route: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
})

router.get('/', protect, async (req: AuthRequest, res: Response):Promise<void> =>{
    try{
        const transactions = await transactionRespository.find({
            where:{
                user:{ id: req.userId}
            },
            relations:{category: true},
            order:{createdAt:"DESC"}
        })
        const formatted = transactions.map(t=>({
            id: t.id,
            title: t.title,
            amount: parseFloat(t.amount as any),
            type: t.type,
            note: t.note,
            category: t.category?.name,
            createdAt: t.createdAt
        }))
        res.status(200).json({transactions: formatted})
    }
    catch(error){
        console.error(`Error in getting all the expenses: ${error}`)
        res.status(500).json({message: "Internal server error"})
    }
})

export default router;