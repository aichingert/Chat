import express from "express";
import { Request, Response } from "express";
import { port, AppDataSource } from "./data-source";
import bodyParser from "body-parser"
import { User } from "./entity/User";
import { Chat } from "./entity/Chat";
import { UserController} from "./controller/UserController";
import { ChatController } from "./controller/ChatController";
import ws from "ws";
import cors from "cors";
import {Message} from "./entity/Message";
import {MessageController} from "./controller/MessageController";

const userController: UserController = new UserController();
const chatController: ChatController = new ChatController();
const messageController: MessageController = new MessageController();
const websocket: ws.WebSocket = new ws.WebSocket("ws://127.0.0.1:42069/?type=bot&key=" + process.env.EXPRESS_SERVER_TOKEN);

AppDataSource.initialize().then(async () => {
    // Create express app

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cors());

    // Express entry points

    app.post("/login", async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body;

        const db_user: User | string = await userController.get_one_by_name(user.name);
        if(typeof db_user === "string") {
            // 404 => Not found
            res.sendStatus(404);
            return;
        }

        websocket.send("approve " + db_user.id);

        // 302 => Found
        res.sendStatus(302).send(db_user.id);
    });

    app.post("/logout", async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body;

        const db_user: User | string = await userController.get_one_by_name(user.name);

        if (typeof db_user === "string") {
            // 404 => Not found
            res.sendStatus(404);
            return;
        }

        websocket.send("disapprove " + db_user.id);

        // 302 => Found
        res.sendStatus(302);
    });

    app.post("/register", async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body;

        if (!user) {
            // 400 => Bad request
            res.sendStatus(400);
            return;
        }

        if (typeof await userController.get_one_by_name(user.name) !== "string") {
            // 403 => Forbidden
            res.sendStatus(403);
            return;
        }

        const id: number = (await userController.save(user)).id;

        websocket.send(id);
        res.sendStatus(201).send(id);
    });

    app.get("/user/chats", async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body;

        const db_user: User | string = await userController.get_one_by_name(user.name);

        if (typeof db_user === "string") {
            // 400 => Bad request
            res.sendStatus(400);
            return;
        }

        const chats: Chat[] | string = await chatController.get_user_chats(db_user.id);

        if (typeof chats === "string") {
            // 404 Not found
            res.sendStatus(404);
            return;
        }

        res.send(JSON.stringify(chats));
    });

    app.get("/chats/:chatId", async (req: Request, res: Response): Promise<void> => {
        const chat: Chat | string = await chatController.one(Number.parseInt(req.params.chatId));

        if(typeof chat === "string"){
            // 404 Not found
            res.sendStatus(404);
            return;
        }

        // 302 => Found
        res.sendStatus(302).send(chat);
    });

    app.get("/see/users", async (req: Request, res: Response) => {
        const users: User[] = await userController.all();
        res.send(users);
    });
    app.get("/see/chats", async (req: Request, res: Response) => {
        const chats: Chat[] = await chatController.all();
        res.send(chats);
    });
    app.get("/see/messages", async (req: Request, res: Response) => {
        const messages: Message[] = await messageController.all();
        res.send(messages);
    });

    // Starting express server
    app.listen(port);

    // Test users, chats and messages => for testing
    // await loadTestData();

    console.log(`Express server has started on port ${port}.`);
}).catch(error => console.log(error))

async function loadTestData() {
    // Creating users
    const Michael = new User();
    Michael.name = "Michael";
    Michael.password = "Secure123";

    const Hannah = new User();
    Hannah.name = "Hannah";
    Hannah.password = "MoinM31ster";

    const Thomas = new User();
    Thomas.name = "Thomas";
    Thomas.password = "Tomate!23";

    // creating chats
    const chatBetweenMichaelAndHannah = new Chat();
    chatBetweenMichaelAndHannah.user1 = Michael;
    chatBetweenMichaelAndHannah.user2 = Hannah;

    const chatBetweenMichaelAndThomas = new Chat();
    chatBetweenMichaelAndThomas.user1 = Michael;
    chatBetweenMichaelAndThomas.user2 = Thomas;

    // creating messages
    const messageInChatMH = new Message();
    messageInChatMH.user = Michael;
    messageInChatMH.chat = chatBetweenMichaelAndHannah;
    messageInChatMH.content = "Wie geht es dir?";
    messageInChatMH.written_at = Date.now();

    const messageInChatHM = new Message();
    messageInChatHM.user = Hannah;
    messageInChatHM.chat = chatBetweenMichaelAndHannah;
    messageInChatHM.content = "Gut und dir?";
    messageInChatHM.written_at = Date.now();

    // saving users in db
    await userController.save(Michael);
    await userController.save(Hannah);
    await userController.save(Thomas);

    // saving chats in db
    await chatController.save(chatBetweenMichaelAndHannah);
    await chatController.save(chatBetweenMichaelAndThomas);

    // saving messages in db
    await messageController.save(messageInChatMH);
    await messageController.save(messageInChatHM);

    /* Clean up
    await messageController.remove_all();
    await chatController.remove_all();
    await userController.remove_all();
     */
}