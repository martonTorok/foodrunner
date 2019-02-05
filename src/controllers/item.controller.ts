import { Request, Response } from 'express';

import * as itemService from '../services/item.service';

export class ItemController {

    public async getAllItems(request: Request, response: Response) {
        try {
            const items = await itemService.getAllItems();
            response.status(200).send(items);
        } catch (e) {
            response.status(404);
        }
    }

    public async getItemsByCategory(request: Request, response: Response) {
        const category = request.query.category;
        try {
            const items = await itemService.getItemsByCategory(category);
            response.status(200).send(items);
        } catch (e) {
            response.status(400).send(e);
        }
    }

    public async getItemById(request: Request, response: Response) {
        const id = request.params.id;
        try {
            const item = await itemService.getItemById(id);
            response.status(200).send(item);
        } catch (e) {
            response.status(400).send(e);
        }
    }
}