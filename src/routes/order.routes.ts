import * as express from "express";
import { OrderController } from "../controllers/order.controller";
import authenticate from "../middleware/authenticate.middleware";

export class OrderRoutes {
    private orderController: OrderController = new OrderController();

    public routes(app: express.Application): void {
        app.route('/create-order')
            .post(authenticate, this.orderController.createOrder);

    }
}