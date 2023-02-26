import WS from "ws";
import {getUser} from "./index";
export class ExpressSocket {
    constructor(public readonly ws: WS.WebSocket) {}
}

export class Chat {
    constructor(public webSocketIds: number[], public readonly chatId: number) {}

    sendMessage(msg: Message) {
        this.webSocketIds.filter(webSocket => webSocket !== msg.senderId).forEach(wsId => {
            let user = getUser(wsId);

            if (user) {
                user.send(JSON.stringify(msg));
            } else {
                //TODO: Notify DB
            }
        });
    }
}

export class WebSocketWrapper {
    constructor(public readonly ws: WS.WebSocket, public readonly id: number) {}

    send(msg: string) {
        this.ws.send(msg);
    }
}

export class Message {
    constructor(public readonly senderId: number, public readonly chatId: number, public readonly message: string, public readonly time: Date) {}
}