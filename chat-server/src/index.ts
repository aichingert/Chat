import ws from "ws";
import {IncomingMessage} from "http"
import {Chat, ExpressSocket, Message, WebSocketWrapper} from "./Models";
import axios, {AxiosResponse} from "axios";

const wss = new ws.Server({ port: 42069 });
let bot: ExpressSocket | null = null;
let approvedIds: number[] = [];
let webSocketWrappers: WebSocketWrapper[] = [];
let loadedChats: Chat[];

export function getUser(id: number): WebSocketWrapper[] {
    return webSocketWrappers.filter((ws: WebSocketWrapper) => ws.id === id);
}

wss.on("connection", (ws: ws.WebSocket, request: IncomingMessage) => {
    if (!request) {
        return;
    }

    const urlParams: URLSearchParams = new URLSearchParams(request.url!.trim());
    let wsw: WebSocketWrapper;
    if (bot === null && urlParams.has("type") && urlParams.has("key")) {
        if (urlParams.get("type") === 'bot' && urlParams.get("key") === process.env.EXPRESS_SERVER_TOKEN) {
            bot = new ExpressSocket(ws);
        }
    } else if (!urlParams.has("id") || !urlParams.has("client") || !approvedIds.includes(Number.parseInt(urlParams.get("id")!))) {
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
                    approvedIds = approvedIds.filter((id: number) => id !== Number.parseInt(args.shift()!.trim()))
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
                } catch (e) {
                    console.error(e);
                    return;
                }
            }

            chat.sendMessage(message);
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