import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { UserController } from "./controller/UserController"

AppDataSource.initialize().then(async () => {

    // create express app
    const app: express = express();
    const portNumber: number = 3000;
    let controller: UserController = new UserController;
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

        let userList: User[] = await controller.all(req, res, () => {});

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
        await controller.save(req, res, () => {});
    });
    
    app.get('/friends/:userId', async (req: Request, res: Response) => {
        let user: User | string = await controller.one(req,res, () => {});
        
        if(user instanceof User){
            res.send(JSON.stringify(user.friends, null, '\t'));
            res.sendStatus(302);
        }
        else{
            res.sendStatus(404);
        }

    });
    
    app.route('/friends/:userId/:friendId')
        .put(async (req: Request, res: Response) => {
            let userList: User[] = await controller.all(req, res, () => {});

            let user: User = userList.find(u => u.id === req.params.userId);
            let friend: User = userList.find(u => u.id === req.params.friendId);

            if(user instanceof undefined || friend instanceof undefined){
                res.sendStatus(404);
            }
            else{
                user.friends.push(friend);
                res.sendStatus(302);
            }        
        })
        .delete(async (req: Request, res: Response) => {
            let userList: User[] = await controller.all(req, res, () => {});

            let user: User = userList.find(u => u.id === req.params.userId);
            let friend: User = userList.find(u => u.id === req.params.friendId);

            if(user instanceof undefined || friend instanceof undefined){
                res.sendStatus(404);
            }
            else{
                let index: number = user.friends.indexOf(friend);
                
                if(index > -1){
                    user.friends.splice(index, 1);
                }
                
                res.sendStatus(302);
            }     
    });

    // start express server
    app.listen(portNumber)

    // insert new users for test
    /*
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Timber",
            lastName: "Saw",
            age: 27
        })
    )

    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        })
    )

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")
    */

}).catch(error => console.log(error))
