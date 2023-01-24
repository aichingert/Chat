import ws from "ws"

const wss = new ws.Server({port: 42069});

wss.on("connection", ws => {
    ws.send("Bye bye");
    ws.close();
});