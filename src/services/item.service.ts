import Item from "../models/item.model";

export async function getAllItems(): Promise<Item[]> {
    try {
        const items = await Item.findAll();
        return items;
    } catch (e) {
        throw Error('Error while getting all items ' + e);
    }
}

export async function getItemById(id: number): Promise<Item> {
    try {
        const item = await Item.findById(id);
        return item;
    } catch (e) {
        throw Error('Error while getting item ' + e);
    }
}

export async function getItemsByCategory(category: string): Promise<Item[]> {
    try {
        const items = await Item.findAll({where: { category }});
        return items;
    } catch (e) {
        throw Error('Error while getting items by category ' + e);
    }
}

