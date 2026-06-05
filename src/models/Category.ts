import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from './User';
import { Transaction } from './Transaction'

@Entity({name: "category"})
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({nullable: true})
    description?: string;

    @ManyToOne(()=>User)
    user!: User;

    @OneToMany(()=>Transaction, transaction => transaction.category)
    transactions!: Transaction[]

    @CreateDateColumn()
    createdAt!: Date;
}
