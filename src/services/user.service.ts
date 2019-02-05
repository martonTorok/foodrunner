import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import User from "../models/user.model";

export async function getUserById(id: number): Promise<User> {
    try {
        const user = await User.findById(id);
        return user;
    } catch (e) {
        throw Error('Error while getting user by id' + e);
    }
}

export async function getUserByEmail(email: string): Promise<User> {
    try {
        const user = await User.findOne({ where: { email } });
        return user;
    } catch (e) {
        throw Error('Error while getting user by email ' + e);
    }
}

export async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (e) {
        throw Error('Error while hashing password');
    }
}

export async function comparePassword(password: string, user: User): Promise<boolean> {
    try {
        const isValid = bcrypt.compare(password, user.password);
        return isValid;
    } catch (e) {
        throw Error('Error while bcrypt compare');
    }
}

export function generateAuthToken(user: User) {
    return jwt.sign({ id: user.id, access: 'auth' }, process.env.JWT_SECRET, { expiresIn: '12h' }).toString();
}

export async function createUser(email: string, hashedPassword: string) {
    try {
        const user = await User.build({
            email,
            password: hashedPassword
        })
        await user.save();
        return user;
    } catch (e) {
        throw Error('Error while saving user');
    }
}