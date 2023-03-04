import ws from "ws";
import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import { port, AppDataSource } from "./data-source";
import bodyParser from "body-parser"
import { User } from "./entity/User";
import { Chat } from "./entity/Chat";
import {Message} from "./entity/Message";
import { UserController} from "./controller/UserController";
import { ChatController } from "./controller/ChatController";
import {MessageController} from "./controller/MessageController";
import { type } from "os";

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

        const dbUser: User | string = await userController.getOneByName(user.name);

        if(typeof dbUser === "string") {
            // 404 => Not found
            res.sendStatus(404);
            return;
        }

        if (user.password !== dbUser.password) {
            // 400 => Bad request
            res.sendStatus(400);
            return;
        }

        websocket.send("approve " + dbUser.id);

        // 302 => Found
        res.status(302).send(JSON.stringify(dbUser.id));
    });

    app.post("/logout", async (req: Request, res: Response): Promise<void> => {
        const user: User = req.body;

        const dbUser: User | string = await userController.getOneByName(user.name);

        if (typeof dbUser === "string") {
            // 404 => Not found
            res.sendStatus(404);
            return;
        }

        websocket.send("disapprove " + dbUser.id);

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

        if (typeof await userController.getOneByName(user.name) !== "string") {
            // 403 => Forbidden
            res.sendStatus(403);
            return;
        }

        const id: number = (await userController.save(user)).id;

        websocket.send(id);
        res.status(201).send(JSON.stringify(id));
    });

    app.post("/user", async(req : Request, res : Response) : Promise<void> => {
        const userId: number = Number(req.body.id);

        const dbUser : User | string = await userController.one(userId);

        if (typeof dbUser === "string") {
            // 400 => Bad request
            res.sendStatus(400);
            return;
        }

        res.send(JSON.stringify({name:dbUser.name}));
    });

    app.post("/user/chats", async (req: Request, res: Response): Promise<void> => {
        const userId: number = Number(req.body.id);

        const dbUser: User | string = await userController.one(userId);

        if (typeof dbUser === "string") {
            // 400 => Bad request
            res.sendStatus(400);
            return;
        }

        const chats: Chat[] | string = await chatController.getUserChats(dbUser.id);

        if (typeof chats === "string") {
            // 404 Not found
            res.sendStatus(404);
            return;
        }

        let parsedChats : {
                id: number,
                newMessages: number,
                recipient: {
                    name: string
                },
                messages: {
                    content: string,
                    written_at: number,
                    sender: {
                        name: string
                    },
                }[]
        }[] = [];

        for(const chat of chats){
            let recipientId = dbUser.id === chat.user1_id ? chat.user2_id : chat.user2_id;
            let recipient = await userController.one(recipientId);
            if(typeof recipient === "string") return;

            let parsedMessages : {
                content: string,
                written_at: number,
                sender: {
                    name: string
                },
            }[] = [];

            let messages = await messageController.getMessagesFrom(chat.id);
            if(typeof messages === "string") return;
            for(const message of messages){
                let sender = await userController.one(message.user_id);
                if(typeof sender === "string") return;

                parsedMessages.push({
                    content: message.content,
                    sender: { name: sender.name },
                    written_at: message.written_at
                })
            }
                
            parsedChats.push({
                id: chat.id,
                newMessages: chat.new,
                recipient: {name: recipient.name},
                messages: parsedMessages
            })
        }

        res.send(JSON.stringify(parsedChats));
    });

    app.post("/chats/messages", async (req: Request, res: Response): Promise<void> => {
        const chatId: number = Number(req.body.id);

        const messages: Message[] | string = await messageController.getMessagesFrom(chatId);

        if (typeof messages === "string") {
            // 404 => Not found
            res.sendStatus(404);
            return;
        }
    
        let arr : {
            content: string,
            written_at: number,
            sender: {
                name: string
            },
        }[] = [];

        for(const message of messages){
            let sender = await userController.one(message.user_id);
            if(typeof sender === "string") return;

            arr.push({
                content: message.content,
                sender: {name: sender.name},
                written_at: message.written_at
            });
        }

        res.status(200).send(JSON.stringify(arr));
    })

    app.get("/chats/:chatId", async (req: Request, res: Response): Promise<void> => {
        const chat: Chat | string = await chatController.one(Number.parseInt(req.params.chatId));

        if(typeof chat === "string"){
            // 404 Not found
            res.sendStatus(404);
            return;
        }

        // 302 => Found
        res.status(302).send(JSON.stringify(chat));
    });

    app.post("/chats/:chatId/message", async (req: Request, res: Response) => {
        const chatId = Number.parseInt(req.params.chatId);

        const message: Message = req.body;
        const chat: Chat | string = await chatController.one(chatId);

        if(typeof chat !== "string"){
            message.chat_id = chatId;

            await messageController.save(message); 
            await chatController.newMessage(chatId);
            
            // 201 => Created
            res.sendStatus(201);
        }

        // 404 => Not found
        res.sendStatus(404);
    });

    app.get("/chats/:chadId/read", async (req: Request, res: Response) => {
        const chatId = Number.parseInt(req.params.chatId);

        const chat: Chat | string = await chatController.one(chatId);

        if(typeof chat !== "string"){
            await chatController.resetNewMessages(chatId);
            
            // 200 => OK
            res.sendStatus(200);
        }

        // 404 => Not found
        res.sendStatus(404);
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
    await loadTestData();

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
    chatBetweenMichaelAndHannah.new = 1;

    const chatBetweenMichaelAndThomas = new Chat();
    chatBetweenMichaelAndThomas.user1 = Michael;
    chatBetweenMichaelAndThomas.user2 = Thomas;
    chatBetweenMichaelAndThomas.new = 0;

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