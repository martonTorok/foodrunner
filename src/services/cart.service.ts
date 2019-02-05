import User from "../models/user.model";
import Cart from "../models/cart.model";
import ItemCart from "../models/item-cart.model";
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
    } catch(e) {
        throw Error('Error while creating Cart');
    }
}

export async function getCartItem(item: Item, cart: Cart): Promise<ItemCart> {
    try {
        const itemCart = await ItemCart.findOne({
            where: {
                cartId: cart.id,
                itemId: item.id
            }
        });
        return itemCart;
    } catch (e) {
        throw Error('Error while getting cart item ' + e);
    }
}

export async function getCartItems(cart: Cart): Promise<ItemCart[]> {
    try {
        const itemsCart = await ItemCart.findAll({
            where: {
                cartId: cart.id
            },
            include: [{
                model: Item,
                as: 'item'
            }]
        });
        return itemsCart;
    } catch (e) {
        throw Error('Error while getting cart items ' + e)
    }
}

export async function createCartItem(item: Item, cart: Cart): Promise<ItemCart> {
    try {
        return await ItemCart.build({
            cartId: cart.id,
            itemId: item.id,
            totalPrice: item.price,
            totalQuantity: 1
        }).save();
    } catch (e) {
        throw Error('Error while saving cart item ' + e);
    }
}

export async function addCartItem(itemCart: ItemCart, item: Item): Promise<ItemCart> {
    try {
        return await itemCart.update({
            totalQuantity: itemCart.totalQuantity + 1,
            totalPrice: item.price * (itemCart.totalQuantity + 1)
        })
    } catch (e) {
        throw Error('Error while updating cart item ' + e)
    }
}

export async function removeCartItem(itemCart: ItemCart, item: Item): Promise<ItemCart> {
    try {
        return await itemCart.update({
            totalQuantity: itemCart.totalQuantity - 1,
            totalPrice: item.price * (itemCart.totalQuantity - 1)
        })
    } catch (e) {
        throw Error('Error while updating cart item ' + e)
    }
}

export async function destroyCartItem(cart: Cart): Promise<number> {
    try {
        return await ItemCart.destroy({ where: { cartId: cart.id } })
    } catch (e) {
        throw Error('Error while destroying car item ' + e);
    }
}
