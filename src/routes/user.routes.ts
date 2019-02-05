import * as express from "express";
import { UserController } from "../controllers/user.controller";

export class UserRoutes {
    private userController: UserController = new UserController();

    public routes(app: express.Application): void {
        app.route('/user/register')
            .post(this.userController.addNewUser);

        app.route('/user/login')
            .post(this.userController.login);
    }
}