import 'reflect-metadata';
import { DataSource } from "typeorm";
import { User } from '../models/User';
import { Transaction } from '../models/Transaction'
import { Category } from '../models/Category';

import dotenv from "dotenv"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, Category, Transaction]
})