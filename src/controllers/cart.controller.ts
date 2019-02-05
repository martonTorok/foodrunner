import { Request, Response } from 'express';

import * as cartService from '../services/cart.service';
import * as itemService from '../services/item.service';

export class CartController {

    public async getCartItems(request: Request, response: Response) {
        const userId = request['user'].id;
        try {
            const cart = await cartService.getCart(userId);
            const cartItems = await cartService.getCartItems(cart);
            let totalPrice = 0;
            cartItems.forEach(item => {
                totalPrice += item.totalPrice;
            })
            response.status(200).send({ totalPrice, cartItems });
        } catch (e) {
            response.status(500).send(e);
        }
    }

    public async addItemToCard(request: Request, response: Response) {
        const userId = request['user'].id;
        const itemId = request.params.id;
        try {
            const item = await itemService.getItemById(itemId);
            const cart = await cartService.getCart(userId);
            const itemCart = await cartService.getCartItem(item, cart);
            if (itemCart === null) {
                await cartService.createCartItem(item, cart);
            } else {
                await cartService.addCartItem(itemCart, item);
            }
            const itemsCart = await cartService.getCartItems(cart);
            response.status(200).send(itemsCart);
        } catch (e) {
            response.status(500).send(e);
        }
    }

    public async removeFromCart(request: Request, response: Response) {
        const userId = request['user'].id;
        const itemId = request.params.id;
        try {
            const item = await itemService.getItemById(itemId);
            const cart = await cartService.getCart(userId);
            const itemCart = await cartService.getCartItem(item, cart);
            if (itemCart === null) {
                response.status(400).send({ error: `No item: ${itemId} in cart!` })
            } else {
                await cartService.removeCartItem(itemCart, item);
            }
            const itemsCart = await cartService.getCartItems(cart);
            response.status(200).send(itemsCart);
        } catch (e) {
            response.status(500).send(e);
        }
    }

    public async emptyCart(request: Request, response: Response) {
        const userId = request['user'].id;
        try {
            const cart = await cartService.getCart(userId);
            await cartService.destroyCartItem(cart);
            const itemsCart = await cartService.getCartItems(cart);
            response.status(200).send(itemsCart);
        } catch (e) {
            response.status(500).send(e);
        }
    }
}