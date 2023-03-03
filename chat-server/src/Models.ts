import WS from "ws";
import {getUser} from "./index";
import axios, {AxiosResponse} from "axios";
export class ExpressSocket {
    constructor(public readonly ws: WS.WebSocket) {}
}

export class Chat {
    constructor(public webSocketIds: number[], public readonly chatId: number) {}

    sendMessage(msg: Message) {
        this.webSocketIds.filter((webSocket: number) => webSocket !== msg.user_id).forEach((wsId: number) => {
            let users: WebSocketWrapper[] = getUser(wsId);

            if (users.length !== 0) {
                users.forEach((user: WebSocketWrapper) => user.send(JSON.stringify(msg)));
            }

            axios.put(`http://127.0.0.1:3000/chats/${msg.chat_id}/message`, msg).catch(e => console.error(e.message));
        });
    }
}

export class WebSocketWrapper {
    constructor(public readonly ws: WS.WebSocket, public readonly id: number) {}

    send(msg: string) {
        this.ws.send(msg);
    }
}

export interface Message {
    id: number,
    user_id: number,
    chat_id: number,
    content: string,
    written_at: number
}