import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { Sequelize } from 'sequelize-typescript';


class App {
    public app: express.Application;
    
    constructor() {
        this.app = express();
        this.config();
        this.dbSetup();
    }

    public listen(): void {
        this.app.listen(process.env.PORT, () => {
            console.log(`Server listening on port: ${process.env.PORT}`);
        })
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(cors());
    }

    private async dbSetup() {
        const sequelize = new Sequelize({
            database: process.env.MYSQL_DATABASE,
            dialect: process.env.DB_DIALECT,
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            modelPaths: [__dirname + '/models']
        });
    }
}

export default App;