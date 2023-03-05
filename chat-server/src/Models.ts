import WS from "ws";
import {getUser} from "./index";
import axios, {AxiosResponse} from "axios";
export class ExpressSocket {
    constructor(public readonly ws: WS.WebSocket) {}
}

export interface Chat {
    webSocketIds: number[],
    chatId: number
}

export class WebSocketWrapper {
    constructor(public readonly ws: WS.WebSocket, public readonly id: number) {}

    send(msg: string) {
        this.ws.send(msg);
    }
}

export interface Message {
    user_id: number,
    chat_id: number,
    content: string,
    written_at: number
}