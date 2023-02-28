import ws from "ws";
import {IncomingMessage} from "http"
import {Chat, ExpressSocket, Message, WebSocketWrapper} from "./WebSocketWrappers";

const wss = new ws.Server({ port: 42069 });
let bot: ExpressSocket | null = null;
let approvedIds: number[] = [];
let webSocketWrappers: WebSocketWrapper[] = [];
let loadedChats: Chat[];

export function getUser(id: number) {
    return webSocketWrappers.find(ws => ws.id === id);
}


wss.on("connection", (ws: ws.WebSocket, request: IncomingMessage) => {
    if (!request) {
        return;
    }

    const urlParams = new URLSearchParams(request.url!.trim());
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

    ws.on("message", msg => {
        if (bot?.ws === ws) {
            let args: string[] = `${msg}`.split(' ');
            let command = args.shift();

            switch (command?.toLocaleLowerCase()) {
                case "approve":
                    approvedIds.push(Number.parseInt(args.shift()!.trim()));
                break;
                case "disapprove":
                    approvedIds = approvedIds.filter(id => id !== Number.parseInt(args.shift()!.trim()))
                break;
            }
        } else {
            let message: Message = JSON.parse(`${msg}`);
            let chat = loadedChats.find(chat => chat.chatId === message.chatId);

            if (!chat) {
                //TODO: Load chat from DB
                chat = new Chat([], 1);
            }

            chat.sendMessage(message);
        }
    })


    ws.on("close", (() => {
        if (bot !== null && bot.ws === ws) {
            bot = null;
        }

        if (wsw) {
            webSocketWrappers = webSocketWrappers.filter(ws => ws !== wsw);
        }
    }));
});