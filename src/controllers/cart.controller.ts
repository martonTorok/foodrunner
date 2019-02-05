import { Request, Response } from 'express';

import * as cartService from '../services/cart.service';
import * as itemService from '../services/item.service';

export class CartController {

    public async getCartItems(request: Request, response: Response) {
        const userId = request['user'].id;
        try {
            const cart = await cartService.getCart(userId);
            const cartItems = await cartService.getCartItems(cart);
            const totalPrice = cartService.getCartTotalPrice(cartItems);
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
            const cartItem = await cartService.getCartItem(item, cart);
            if (cartItem === null) {
                await cartService.createCartItem(item, cart);
            } else {
                await cartService.increaseCartItemQuantity(cartItem, item);
            }
            const cartItems = await cartService.getCartItems(cart);
            response.status(200).send(cartItems);
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
            const cartItem = await cartService.getCartItem(item, cart);
            if (cartItem === null) {
                response.status(400).send({ error: `No item: ${itemId} in cart!` })
            } else {
                await cartService.decreaseCartItemQuantity(cartItem, item);
            }
            const cartItems = await cartService.getCartItems(cart);
            response.status(200).send(cartItems);
        } catch (e) {
            response.status(500).send(e);
        }
    }

    public async emptyCart(request: Request, response: Response) {
        const userId = request['user'].id;
        try {
            const cart = await cartService.getCart(userId);
            await cartService.destroyCartItem(cart);
            const cartItems = await cartService.getCartItems(cart);
            response.status(200).send(cartItems);
        } catch (e) {
            response.status(500).send(e);
        }
    }
}