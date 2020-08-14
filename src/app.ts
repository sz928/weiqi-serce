import WebSocket, { Server } from "ws";
import { MsgId, loginReq, newGameReq, roomSync, playChessReq, playChessRes, resultPush } from "./data";
import { Socket } from "./Socket";

class Main {
    private webSocketServer: Server;
    constructor() {
        let self = this;
        // 实例化:
        this.webSocketServer = new Server({
            port: 8080
        });

        this.webSocketServer.on('connection', function connection(client: WebSocket) {
            client.on("message", self.message.bind(self, client));
        });
        console.log('执行中...');
    }

    private message(client: WebSocket, _data: WebSocket.Data): void {
        let { cmd, data } = this.initData(_data.toString());

        switch (cmd) {
            case MsgId[MsgId.login]:
                Socket.instance.onLogin(data as loginReq, client);
                break;
            case MsgId[MsgId.playChess]:
                Socket.instance.onPlayChessReq(data as playChessReq, client);
                break;
            case MsgId[MsgId.newGameReq]:
                Socket.instance.onNewGameRes(data as newGameReq, client);
                break;
        }
    }

    private initData(_data: string): { cmd: string, data: object } {
        let msg = JSON.parse(_data);
        let { cmd, data } = msg;
        // let index = _data.indexOf('+');
        // let cmd = _data.substr(0, index);
        // let data = _data.substr(index + 1);
        console.info(Socket.roomid + ',收到数据：' + msg);
        return { cmd: cmd, data: data };
    }
}
new Main();