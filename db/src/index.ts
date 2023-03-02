import express from "express"
import bodyParser from "body-parser"
import { Request, Response } from "express"
import { port, AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { Chat } from "./entity/Chat"
import { UserController} from "./controller/UserController"
import { ChatController } from "./controller/ChatController";
import ws from "ws";
import cors from "cors";
import {Message} from "./entity/Message";
import {MessageController} from "./controller/MessageController";

const userController: UserController = new UserController();
const chatController: ChatController = new ChatController();
const messageController: MessageController = new MessageController();
const websocket: ws.WebSocket = new ws.WebSocket('ws://127.0.0.1:42069/?type=bot&key=' + process.env.EXPRESS_SERVER_TOKEN);

AppDataSource.initialize().then(async () => {
    // create express app
    const app = express();

    app.use(bodyParser.json());
    app.use(cors());

    // Express entry points

    app.post('/login', async (req: Request, res: Response) => {
        let user: User = req.body.json();

        let userList: User[] = await userController.all();

        if(userList.find(u => u === user)){
            // gefunden
            websocket.send('approve ' + user.id);
            res.sendStatus(302);
        }
        else{
            // nicht gefunden
            res.sendStatus(404);
        }
    });

    app.post('/logout', async (req: Request, res: Response) => {
        let user: User = req.body.json();

        let userList: User[] = await userController.all();

        if(userList.find(u => u === user)){
            // gefunden
            websocket.send('disapprove ' + user.id);
            res.sendStatus(302);
        }
        else{
            // nicht gefunden
            res.sendStatus(404);
        }
    });

    app.post('/register', async (req: Request, res: Response) => {
        let user: User = req.body;

        let userList: User[] = await userController.all();

        if(userList.find(u => u.name === user.name)){
            res.sendStatus(409);
        } else {
            await userController.save(user);
            res.sendStatus(200);
        }
    });

    app.get('/see/users', async (req: Request, res: Response) => {
        let users: User[] = await userController.all();

        res.send(users);
    });

    app.get('/see/chats', async (req: Request, res: Response) => {
        let chats: Chat[] = await chatController.all();
        console.log(chats);
        res.send(chats);
    });

    app.get('/see/messages', async (req: Request, res: Response) => {
        let messages: Message[] = await messageController.all();
        console.log(messages);
        res.send(messages);
    });

    // Starting express server
    app.listen(port);

    /*
    const user1 = new User();
    user1.name = "u1";
    user1.password = "tt";

    const user2 = new User();
    user2.name = "u2";
    user2.password = "ww";

    const user3 = new User();
    user3.name = "u3";
    user3.password = "u3";

    const chat = new Chat();
    chat.user1 = user1;
    chat.user2 = user2;

    const chat2 = new Chat();
    chat2.user1 = user1;
    chat2.user2 = user3;

    await userController.save(user1);
    await userController.save(user2);
    await userController.save(user3);

    chatController.save(chat).then((saved) => console.log(saved));
    chatController.save(chat2).then((saved) => console.log(saved));
    */
    const gotten_chat = await chatController.one(2);
    const mes = new Message();
    mes.content = "Hallo";
    mes.written = Date.now();
    //console.log(gotten_chat);
    if (typeof gotten_chat !== "string") {
        mes.chat = gotten_chat;
        await messageController.save(mes);
    }

    const user_chats = await chatController.user_chats("u2");
    console.log(user_chats);
    /*
    for (let i = 0; i < 20; i++) {
        await messageController.remove(i);
        await chatController.remove(i);
        await userController.remove(i);
    }
     */

    console.log(`Express server has started on port ${port}.`)
}).catch(error => console.log(error))
