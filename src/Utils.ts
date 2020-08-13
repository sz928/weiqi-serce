import { piece } from "./data";

export class Utils {
    constructor() {
    }
    private static num = 0;
    private static pieceArr: piece[];
    private static downColor: boolean;

    /**
     * 判断自己是否胜利
     * @param point 
     * @param pieceArr 
     * @param downColor 当前落下的棋子是否为黑色
     */
    static result(piece: piece, pieceArr: piece[]): boolean {
        this.pieceArr = pieceArr;
        this.num = 0;
        this.downColor = piece.isBlack;
        let point = { x: piece.x, y: piece.y };
        this.onLeft(point);
        this.onRight(point);
        if (this.num >= 4) {
            return true
        }

        this.num = 0;
        this.onUp(point);
        this.onDown(point);
        if (this.num >= 4) {
            return true
        }

        this.num = 0;
        this.onLeftUp(point);
        this.onRightDown(point);
        if (this.num >= 4) {
            return true
        }

        this.num = 0;
        this.onLeftDown(point);
        this.onRightUp(point);
        if (this.num >= 4) {
            return true
        }

        return false;
    }

    private static onLeft(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x - index && iterator.y == point.y) {
                this.num++;
                index++;
                this.onLeft(point, index);
                break;
            }
        }
    }
    private static onRight(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x + index && iterator.y == point.y) {
                this.num++;
                index++;
                this.onRight(point, index);
                break;
            }
        }
    }
    private static onUp(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x && iterator.y == point.y - index) {
                this.num++;
                index++;
                this.onUp(point, index);
                break;
            }
        }
    }
    private static onDown(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x && iterator.y == point.y + index) {
                this.num++;
                index++;
                this.onDown(point, index);
                break;
            }
        }
    }
    private static onLeftUp(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x - index && iterator.y == point.y - index) {
                this.num++;
                index++;
                this.onLeftUp(point, index);
                break;
            }
        }
    }
    private static onLeftDown(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x - index && iterator.y == point.y + index) {
                this.num++;
                index++;
                this.onLeftDown(point, index);
                break;
            }
        }
    }
    private static onRightUp(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x + index && iterator.y == point.y - index) {
                this.num++;
                index++;
                this.onRightUp(point, index);
                break;
            }
        }
    }
    private static onRightDown(point: { x: number, y: number }, index: number = 1): void {
        for (const iterator of this.pieceArr) {
            if (iterator.isBlack != this.downColor) continue;
            if (iterator.x == point.x + index && iterator.y == point.y + index) {
                this.num++;
                index++;
                this.onRightDown(point, index);
                break;
            }
        }
    }
}