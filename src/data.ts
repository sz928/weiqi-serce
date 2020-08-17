//心跳
export interface heartbeat {
    roomid: number
}

/**登录请求 */
export interface loginReq {
    /**房间ID */
    roomid: number;
}
/**登录响应 */
export interface loginRes {
    /**加入成功为0,失败为-1 */
    code: number
    /**当前玩家执棋颜色 */
    meColreBlack: boolean;
    pieceArr: piece[];
}
/**棋子mode */
export interface piece {
    x: number;
    y: number;
    isBlack: boolean;
}

/**房间状态 */
export interface roomSync {
    playerCount: number;
    nowColreBlack: boolean;
}

/**下棋请求 */
export interface playChessReq {
    roomid: number,
    piece: piece;
}
// 下棋响应
export interface playChessRes {
    code: number,
    piece: piece;
}

// 结算推送
export interface resultPush {
    isBlackWin: boolean;
}

/**新局 */
export interface newGameReq {
    roomid: number
}

export enum MsgId {
    login,
    roomSync,
    playChess,
    resultPush,
    newGameReq,
    heartbeat
}