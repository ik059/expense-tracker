import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database'
import  userRoute from './routes/userRoute'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000;

app.use(express.json())
app.use('/users', userRoute)

app.get('/', (req, res)=>{
    res.json({message: "Expense Tracker API is running"})
})

AppDataSource.initialize().then(()=>{
    console.log("Database connection successful!")
    app.listen(port, ()=>{
        console.log(`Server is running on PORT:${port}`)
    })
}).catch((error)=>{
    console.error(`Database connection failed: ${error}`)
})