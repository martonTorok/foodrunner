import { Response, Request } from 'express';
import * as _ from 'lodash';

import * as userService from '../services/user.service';
import * as cartService from '../services/cart.service';

export class UserController {
    public addNewUser = async (request: Request, response: Response) => {
        try {
            let credentials = _.pick(request.body, ['email', 'password']);
            if (credentials.password.length < 6) {
                return response.status(400).send({ error: 'Password must be minimum 6 characters long!' })
            }
            if (await userService.getUserByEmail(credentials.email)) {
                response.status(400).send({ error: `User with email: ${credentials.email} already registered!` })
            } else {
                credentials.password = await userService.hashPassword(credentials.password);
                const user = await userService.createUser(credentials.email, credentials.password);
                const cart = await cartService.createCart(user);
                const token = userService.generateAuthToken(user);
                user.password = undefined;
                response.header('x-auth', token).send(user);
            }
        } catch (e) {
            response.status(400).send({ error: 'Invalid input' });
        }
    }

    public login = async (request: Request, response: Response) => {
        const credentials = request.body;
        const user = await userService.getUserByEmail(credentials.email);
        if (user) {
            const isPasswordMatching = userService.comparePassword(credentials.password, user);
            if (isPasswordMatching) {
                const token = userService.generateAuthToken(user);
                response.header('x-auth', token);
                response.send(user);
            } else {
                response.status(401).send({ error: 'Wrong credentials!' })
            }
        } else {
            response.status(401).send({ error: 'Wrong credentials!' })
        }
    }
}