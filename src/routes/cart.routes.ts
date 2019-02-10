import * as express from "express";
import { CartController } from "../controllers/cart.controller";
import authenticate from "../middleware/authenticate.middleware";

export class CartRoutes {
    private cartController: CartController = new CartController();

    public routes(app: express.Application): void {
        app.route('/cart')
            .get(authenticate, this.cartController.getCartItems);
            
        app.route('/add-to-cart/:id')
            .post(authenticate, this.cartController.addItemToCart);

        app.route('/remove-from-cart/:id')
            .post(authenticate, this.cartController.removeFromCart);

        app.route('/empty-cart')
            .delete(authenticate, this.cartController.emptyCart);
    }
}