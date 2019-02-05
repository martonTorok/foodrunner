import { Table, Column, Model, HasMany, IsEmail, Length } from 'sequelize-typescript';

import Order from './order.model';

@Table({ tableName: 'Users' })
export default class User extends Model<User> {

    @IsEmail
    @Column
    email: string;

    @Length({ min: 6, max: 16 })
    @Column
    password: string;

    @HasMany(() => Order)
    orders: Order[];
}