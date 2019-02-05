import { Request, Response } from 'express';

import Item from '../models/item.model';

export class ItemController {

    public async getAllItems(request: Request, response: Response) {
        try {
            const items = await Item.find();
            response.status(200).send(items);
        } catch (e) {
            response.status(404);
        }
    }

    public async getItemsByCategory(request: Request, response: Response) {
        const category = request.query.category;
        try {
            const products = await Item.findAll({where: { category }});
            response.status(200).send(products);
        } catch (e) {
            response.status(400).send(e);
        }
    }

    public async getItemById(request: Request, response: Response) {
        const id = request.params.id;
        try {
            const product = await Item.findOne({where:{ id }});
            response.status(200).send(product);
        } catch (e) {
            response.status(400).send(e);
        }
    }
}