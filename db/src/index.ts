import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { port, AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { UserController,  } from "./controller/UserController"
import {FriendListController} from "./controller/FriendListController";
import {FriendList} from "./entity/FriendList";

const userController: UserController = new UserController;
const friendListController: FriendListController = new FriendListController;

AppDataSource.initialize().then(async () => {
    // create express app
    const app: express = express();

    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })

    // setup express app here
    // ...

    app.post('/login', async (req: Request, res: Response) => {
        let user: User = req.json();

        let userList: User[] = await userController.all();

        if(userList.find(u => u === user)){
            // gefunden
            res.sendStatus(302);
        }
        else{
            // nicht gefunden
            res.sendStatus(404);
        }
    });
    
    app.post('/register', async (req: Request, res: Response) => {
        let user: User = JSON.parse(req.body);

        await userController.save(user);
    });
    
    app.get('/friends/:userId', async (req: Request, res: Response) => {
        let user: User | string = await userController.one(req.params.userId);
        
        if(user instanceof User){
            // waiting for controller            

            res.sendStatus(302);
        }
        else{
            res.sendStatus(404);
        }
    });
    
    app.route('/friends/:userId/:friendId')
        .put(async (req: Request, res: Response) => {
            // waiting for controller
        })
        .delete(async (req: Request, res: Response) => {
            // waiting for controller
    });

    const friendList: FriendList = new FriendList();
    friendList.idOne = 1;
    friendList.idTwo = 2;

    await friendListController.save(friendList)

    // start express server
    app.listen(port);

    console.log(`Express server has started on port ${port}.`)

}).catch(error => console.log(error))
