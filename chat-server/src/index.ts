import ws from "ws";
import {IncomingMessage} from "http"
import {Chat, ExpressSocket, Message, WebSocketWrapper} from "./Models";
import axios, {Axios, AxiosResponse} from "axios";
require("dotenv").config();

const wss = new ws.Server({ port: 42069 });
let bot: ExpressSocket | null = null;
let approvedIds: number[] = [];
let webSocketWrappers: WebSocketWrapper[] = [];
let loadedChats: Chat[] = [];

export function getUser(id: number): WebSocketWrapper[] {
    return webSocketWrappers.filter((ws: WebSocketWrapper) => ws.id === id);
}

async function sendMessage(msg: Message, chat: Chat) {
    let res = await axios.put(`http://127.0.0.1:3000/chats/${msg.chat_id}/message`, msg).catch(e => console.error(e.message)) as AxiosResponse<any, Message>;

    chat.webSocketIds.forEach((wsId: number) => {
        let users: WebSocketWrapper[] = getUser(wsId);

        if (users.length !== 0) {
            users.forEach((user: WebSocketWrapper) => user.send(JSON.stringify(res.data)));
        }
    });
}

wss.on("connection", (ws: ws.WebSocket, request: IncomingMessage) => {
    if (!request) {
        return;
    }

    const urlParams: URLSearchParams = new URLSearchParams(request.url!.trim());
    let wsw: WebSocketWrapper;
    if (bot === null && urlParams.has("/?type") && urlParams.has("key")) {
        if (urlParams.get("/?type") === 'bot' && urlParams.get("key") === process.env.EXPRESS_SERVER_TOKEN) {
            bot = new ExpressSocket(ws);
        }
    } else if (!urlParams.has("id") || !urlParams.has("/?client") || !approvedIds.includes(Number.parseInt(urlParams.get("id")!))) {
        ws.close();
        return;
    } else {
        wsw = new WebSocketWrapper(ws, Number.parseInt(urlParams.get("id")!));
        webSocketWrappers.push(wsw);
    }

    ws.on("message", async (msg: ws.RawData) => {
        if (bot?.ws === ws) {
            let args: string[] = `${msg}`.split(' ');
            let command: string = args.shift()!;

            switch (command?.toLocaleLowerCase()) {
                case "approve":
                    approvedIds.push(Number.parseInt(args.shift()!.trim()));
                break;
                case "disapprove":
                    approvedIds = approvedIds.filter((id: number) => id !== Number.parseInt(args.shift()!.trim()));
                break;
                case "chat":
                    if (args.length === 5) {
                        let sentId = Number.parseInt(args.shift()!.trim());
                        let receiveId = Number.parseInt(args.shift()!.trim())
                        let sentName = args.shift()!.trim();
                        let toName = args.shift()!.trim();
                        let chatId = args.shift()!.trim();
                        webSocketWrappers.filter(ws => ws.id === sentId).forEach(ws => ws.send(`${toName}:${chatId}`));
                        webSocketWrappers.filter(ws => ws.id === receiveId).forEach(ws => ws.send(`${sentName}:${chatId}`));
                    } else if (args.length > 2) {
                        let chatId = args.shift()!.trim();
                        let chatName = args.shift()!.trim();
                        let ids = args.map(arg => Number.parseInt(arg));

                        webSocketWrappers.filter(ws => ids.includes(ws.id))
                            .forEach(ws => ws.send(JSON.stringify({
                                chatId: chatId,
                                chatName: chatName,
                                ids: ids
                            })));
                    }
                break;
                case "delete_message":
                    let chatId = args.shift()!.trim();
                    let msgId = args.shift()!.trim();
                    let sentId = Number.parseInt(args.shift()!.trim());
                    let toId = Number.parseInt(args.shift()!.trim());
                    let sentName = args.shift()!.trim();
                    let toName = args.shift()!.trim();

                    webSocketWrappers.filter(ws => ws.id === sentId).forEach(ws => ws.send(`del ${chatId}:${toName}:${msgId}`));
                    webSocketWrappers.filter(ws => ws.id === toId).forEach(ws => ws.send(`del ${chatId}:${sentName}:${msgId}`));
                break;
            }
        } else {
            let message: Message = JSON.parse(`${msg}`);
            let chat: Chat | undefined = loadedChats.find((chat: Chat) => chat.chatId === message.chat_id);

            if (!chat) {
                let res: AxiosResponse<Chat, any>;

                try {
                    res = await axios.get(`http://127.0.0.1:3000/chats/${message.chat_id}`);
                    chat = res.data;
                    loadedChats.push(chat);
                } catch (e) {
                    console.error(e);
                    return;
                }
            }

            sendMessage(message, chat);
        }
    })


    ws.on("close", (() => {
        if (bot !== null && bot.ws === ws) {
            bot = null;
        }

        if (wsw) {
            webSocketWrappers = webSocketWrappers.filter((ws: WebSocketWrapper) => ws !== wsw);
        }
    }));
});