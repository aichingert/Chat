import ws from "ws";
import {IncomingMessage} from "http"
import {ExpressSocket, WebSocketWrapper} from "./Models";
require("dotenv").config();

const wss = new ws.Server({ port: 42069 });
let bot: ExpressSocket | null = null;
let approvedIds: number[] = [];
let webSocketWrappers: WebSocketWrapper[] = [];

function getUsers(id: number): WebSocketWrapper[] {
    return webSocketWrappers.filter((ws: WebSocketWrapper) => ws.id === id);
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
            let action: {
                "type": string,
                "action": string,
                "content": any
            } = JSON.parse(`${msg}`);

            switch (action.type) {
                case "ids":
                    switch (action.action)
                    {
                        case "add":
                            approvedIds.push(action.content.id);
                        break;
                        case "remove":
                            approvedIds = approvedIds.filter((id: number) => id !== action.content.id);
                        break;
                    }
                break;
                case "chat":
                    switch (action.action) {
                        case "add":
                            webSocketWrappers.filter(ws => ws.id === action.content.sentId).forEach(ws => ws.send(JSON.stringify({
                                type: "chat",
                                action: "add",
                                content: {
                                    chatId: action.content.chatId,
                                    userName: action.content.toName
                                }
                            })));
                            webSocketWrappers.filter(ws => ws.id === action.content.receiveId).forEach(ws => ws.send(JSON.stringify({
                                type: "chat",
                                action: "add",
                                content: {
                                    chatId: action.content.chatId,
                                    userName: action.content.sentName
                                }
                            })));
                        break;
                    }

                break;
                case "message":
                    switch (action.action) {
                        case "add":
                            let chat = action.content.chat;

                            let users: WebSocketWrapper[] = getUsers(action.content.userId1);
                            users.concat(getUsers(action.content.userId2));

                            if (users.length !== 0) {
                                users.forEach((user: WebSocketWrapper) => user.send(JSON.stringify({
                                    type: "message",
                                    action: "add",
                                    content: chat
                                })));
                            }
                        break;
                        case "remove":
                            webSocketWrappers.filter(ws => ws.id === action.content.sentId || ws.id === action.content.toId).forEach(ws => ws.send(JSON.stringify({
                                type: "message",
                                action: "delete",
                                content: {
                                    chatId: action.content.chatId,
                                    messageId: action.content.msgId
                                }
                            })));
                        break;
                    }
                break;
            }
        }
    });


    ws.on("close", (() => {
        if (bot !== null && bot.ws === ws) {
            bot = null;
        }

        if (wsw) {
            webSocketWrappers = webSocketWrappers.filter((ws: WebSocketWrapper) => ws !== wsw);
        }
    }));
});