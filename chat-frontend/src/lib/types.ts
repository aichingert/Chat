export interface User {
    id: number,
    name: string
}

export interface Chat {
    id: number,
    newMessages: number,
    recipient: Contact,
    messages: Message[]
}

export interface Message {
    content: string,
    written_at: number,
    sender: Contact,
}

export interface Contact {
    name: string
}