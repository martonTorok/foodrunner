import User from "../models/user.model";
import Cart from "../models/cart.model";
import CartItem from "../models/item-cart.model";
import Item from "../models/item.model";

export async function getCart(userId: number): Promise<Cart> {
    try {
        const cart = await Cart.findOne({ where: { userId: userId } })
        return cart;
    } catch (e) {
        throw Error('Error while getting cart ' + e);
    }
}

export async function createCart(user: User): Promise<Cart> {
    try {
        const cart = await Cart.build({
            userId: user.id
        })
        await cart.save();
        return cart;
    } catch (e) {
        throw Error('Error while creating Cart');
    }
}

export function getCartTotalPrice(cartItems: CartItem[]): number {
    let totalPrice = 0;
    cartItems.forEach(item => {
        totalPrice += item.totalPrice;
    })
    return totalPrice;
}

export async function getCartItem(item: Item, cart: Cart): Promise<CartItem> {
    try {
        const cartItem = await CartItem.findOne({
            where: {
                cartId: cart.id,
                itemId: item.id
            }
        });
        return cartItem;
    } catch (e) {
        throw Error('Error while getting cart item ' + e);
    }
}

export async function getCartItems(cart: Cart): Promise<CartItem[]> {
    try {
        const cartItems = await CartItem.findAll({
            where: {
                cartId: cart.id
            },
            include: [{
                model: Item,
                as: 'item'
            }]
        });
        return cartItems;
    } catch (e) {
        throw Error('Error while getting cart items ' + e)
    }
}

export async function createCartItem(item: Item, cart: Cart): Promise<CartItem> {
    try {
        return await CartItem.build({
            cartId: cart.id,
            itemId: item.id,
            totalPrice: item.price,
            totalQuantity: 1
        }).save();
    } catch (e) {
        throw Error('Error while saving cart item ' + e);
    }
}

export async function increaseCartItemQuantity(cartItem: CartItem, item: Item): Promise<CartItem> {
    try {
        return await cartItem.update({
            totalQuantity: cartItem.totalQuantity + 1,
            totalPrice: item.price * (cartItem.totalQuantity + 1)
        })
    } catch (e) {
        throw Error('Error while updating cart item ' + e)
    }
}

export async function decreaseCartItemQuantity(cartItem: CartItem, item: Item): Promise<CartItem | number> {
    try {
        if (cartItem.totalQuantity === 1) {
            return await CartItem.destroy({ where: { id: cartItem.id } });
        }
        return await cartItem.update({
            totalQuantity: cartItem.totalQuantity - 1,
            totalPrice: item.price * (cartItem.totalQuantity - 1)
        })
    } catch (e) {
        throw Error('Error while updating cart item ' + e)
    }
}

export async function destroyCartItem(cart: Cart): Promise<number> {
    try {
        return await CartItem.destroy({ where: { cartId: cart.id } })
    } catch (e) {
        throw Error('Error while destroying car item ' + e);
    }
}
