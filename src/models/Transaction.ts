import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from './User';
import { Category } from './Category'

export enum TranscationType {
    Income = "income",
    Expense = "expense"
}

@Entity({name: "transactions"})
export class Transaction {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    title!: string;
    
    @Column("decimal", { precision: 10, scale: 2})
    amount!: number;

    @Column({
        type:"enum",
        enum: TranscationType,
        default: TranscationType.Expense
    })
    type!: TranscationType;

    @Column({nullable: true})
    note?: string;

    @ManyToOne(()=> User, {nullable: false})
    user!:User;

    @ManyToOne(()=> Category, category => category.transactions, {nullable: false})
    category!: Category;

    @CreateDateColumn()
    createdAt!: Date;
}