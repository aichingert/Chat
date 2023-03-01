export interface User {
    id: number,
    name: string
}

export interface Chat {
    recipient: Contact,
    messages: Message[]
}

export interface Message {
    text: string,
    sender: Contact,
}

export interface Contact {
    name: string
}