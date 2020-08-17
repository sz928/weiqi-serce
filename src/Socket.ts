import WebSocket from "ws";
import { loginReq, roomSync, playChessReq, playChessRes, resultPush, newGameReq, loginRes, piece, MsgId, heartbeat } from "./data";
import { Utils } from "./Utils";

export class Socket {
    /*房间的玩家 */
    private rooms: Map<number, WebSocket[]>;
    /**所有的棋盘 */
    private allPieceArr: Map<number, piece[]>
    /**当前房间 棋子颜色 */
    private roomStatus: Map<number, boolean>;

    // private timeoutArr: NodeJS.Timeout;

    static roomid: number = 0;

    constructor() {
        this.rooms = new Map();
        this.allPieceArr = new Map();
        this.roomStatus = new Map();
    }

    private static _instance: Socket;
    static get instance(): Socket {
        if (!this._instance) {
            this._instance = new Socket();
        }
        return this._instance;
    }

    /**
     * 加入房间是否成功
     * @param roomid 
     * @param client 
     */
    private setClient(roomid: number, client: WebSocket): { joinSuc: boolean, obj: WebSocket[] | undefined } {
        let bool = true;
        let obj: WebSocket[] | undefined = this.rooms.get(roomid);
        if (!obj) {
            this.rooms.set(roomid, [client]);
            this.allPieceArr.set(roomid, []);
            this.roomStatus.set(roomid, true);
        } else {
            if (obj.length == 1) {
                obj.push(client);
            } else {
                bool = false;
            }
        }
        return { joinSuc: bool, obj: obj };
    }

    private sendMsg(target: WebSocket, name: MsgId, data: any) {
        let cmd = MsgId[name];
        // let msg = JSON.stringify(data);
        let sendData = { cmd: cmd, data: data };
        target.send(JSON.stringify(sendData));
        console.info(Socket.roomid + ',发送数据：' + sendData);
    }

    private allSendMsg(roomid: number, name: MsgId, data: any): void {
        let obj = this.rooms.get(roomid);
        if (!obj) obj = [];
        for (const iterator of obj) {
            this.sendMsg(iterator, name, data);
        }
    }

    private getRoomidByClient(client: WebSocket): number {
        let num = -1;
        this.rooms.forEach((v, k) => {
            for (const iterator of v) {
                if (iterator == client) {
                    num = k;
                    break;
                }
            }
        })
        return num;
    }

    private roomSys(roomid: number): void {
        let obj = this.rooms.get(roomid);
        let nowColor = this.roomStatus.get(roomid);
        if (nowColor == undefined) nowColor = true;
        let roomSyncBack: roomSync = {
            playerCount: obj ? obj.length : 0,
            nowColreBlack: nowColor
        }
        this.allSendMsg(roomid, MsgId.roomSync, roomSyncBack);
    }


    onLogin(data: loginReq, client: WebSocket): void {
        Socket.roomid = data.roomid;
        let { joinSuc, obj } = this.setClient(data.roomid, client);

        let arr = this.allPieceArr.get(data.roomid);
        if (!arr) arr = [];
        let isBlack = true;
        if (obj && obj.indexOf(client) == 1) isBlack = false;

        let back: loginRes = {
            code: joinSuc ? 0 : -1,
            meColreBlack: isBlack,
            pieceArr: arr
        }
        this.sendMsg(client, MsgId.login, back);

        this.roomSys(data.roomid);
    }
    onPlayChessReq(data: playChessReq, client: WebSocket): void {
        let error = 0;
        let roomid = data.roomid
        if (!roomid) {
            roomid = this.getRoomidByClient(client);
            if (roomid == -1) error = 1;
        }
        let bool = null;
        let pieceArr = this.allPieceArr.get(roomid);
        if (pieceArr && pieceArr.indexOf(data.piece) >= 0) {
            error = -1
        } else {
            pieceArr?.push(data.piece);
            this.roomStatus.set(roomid, !data.piece.isBlack);
            bool = Utils.result(data.piece, pieceArr ? pieceArr : []);
        }

        let back: playChessRes = {
            code: error,
            piece: data.piece
        }
        this.allSendMsg(roomid, MsgId.playChess, back);

        this.roomSys(roomid);
        if (bool) this.onResultPush(roomid, data.piece.isBlack);
    }
    private onResultPush(roomid: number, winIsBlack: boolean): void {
        let back: resultPush = {
            isBlackWin: winIsBlack
        }
        this.allSendMsg(roomid, MsgId.resultPush, back);
    }
    onNewGameRes(data: newGameReq, client: WebSocket): void {
        // this.rooms.delete(data.roomid);
        this.roomStatus.set(data.roomid, true);
        this.allPieceArr.get(data.roomid)?.splice(0);
        this.roomSys(data.roomid);
        let back: newGameReq = {
            roomid: data.roomid
        }
        this.sendMsg(client, MsgId.newGameReq, back);
    }

    // 心跳
    onHeartbeat(data: heartbeat, client: WebSocket): void {
        // TODO 心跳计时器
        // this.timeoutArr = setInterval(() => {

        // }, 6000)
    }

}