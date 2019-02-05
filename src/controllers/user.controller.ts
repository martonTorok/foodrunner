import { Response, Request } from 'express';
import * as _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import User from '../models/user.model';
import Cart from '../models/cart.model';

export class UserController {
    public addNewUser = async (request: Request, response: Response) => {
        try {
            let credentials = _.pick(request.body, ['email', 'password']);
            if (credentials.password.length < 6) { return response.status(400).send({ error: 'Password must be minimum 6 characters long!' }) }
            if (await User.findOne({ where: { email: credentials.email } })) {
                response.status(400).send({ error: `User with email: ${credentials.email} already registered!` })
            } else {
                credentials.password = await bcrypt.hash(credentials.password, 10);
                const user = User.build({
                    email: credentials.email,
                    password: credentials.password
                })
                await user.save();
                const cart = new Cart({ userId: user.id });
                await cart.save()
                const token = this.generateAuthToken(user);
                user.password = undefined;
                response.header('x-auth', token).send(user);
            }
        } catch (e) {
            response.status(400).send({ error: 'Invalid input' });
        }
    }

    public login = async (request: Request, response: Response) => {
        const credentials = request.body;
        const user = await User.findOne({ where: { email: credentials.email } });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                const token = this.generateAuthToken(user);
                response.header('x-auth', token);
                response.send(user);
            } else {
                response.status(401).send({ error: 'Wrong credentials!' })
            }
        } else {
            response.status(401).send({ error: 'Wrong credentials!' })
        }
    }

    private generateAuthToken(user: User) {
        return jwt.sign({ id: user.id, access: 'auth' }, process.env.JWT_SECRET, { expiresIn: '12h' }).toString();
    }

}