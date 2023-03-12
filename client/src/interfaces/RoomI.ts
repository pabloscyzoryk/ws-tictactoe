import { BoardT } from "../types/BoardT";
import { ScoreT } from "../types/ScoreT";
import { MessageI } from "./MessageI";
import UserI from './UserI';

export interface RoomI {
    id: (string),
    users: UserI[],
    board: BoardT,
    isXMove: boolean,
    isGameFinished: boolean,
    winner: string | null,
    chat: MessageI[],
    turns: number,
    wonConditions: number[],
    score: ScoreT,
    requestedRematch: boolean,
}