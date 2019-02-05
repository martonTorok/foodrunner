import * as express from "express";
import { ItemController } from "../controllers/item.controller";

export class ItemRoutes {
    private itemController: ItemController = new ItemController();

    public routes(app: express.Application): void {
        app.route('/items')
            .get(this.itemController.getItemsByCategory);

        app.route('/items/:id')
            .get(this.itemController.getItemById);
    }
}