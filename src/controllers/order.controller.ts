import { Request, Response } from 'express';
import * as _ from 'lodash';

import * as cartService from '../services/cart.service';
import * as orderService from '../services/order.service';

export class OrderController {
    public async createOrder(request: Request, response: Response) {
        const userId = request['user'].id;
        const body = _.pick(request.body, ['address', 'fullname', 'phonenumber']);
        try {
            const cart = await cartService.getCart(userId);
            const cartItems = await cartService.getCartItems(cart);
            const order = await orderService.createOrder(userId, body.address, body.fullname, body.phonenumber);
            const orderItems = await orderService.createOrderItems(order, cartItems);
            response.status(200).send(order);
        } catch (e) {
            response.status(500).send(e);
        }
    }
}