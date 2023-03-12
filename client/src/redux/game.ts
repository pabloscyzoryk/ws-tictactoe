import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { ScoreT } from '../types/ScoreT';

interface GameState {
    score: ScoreT;
    waitingForRematch: boolean;
    nickname: string;
    amIX: boolean | null;
    isXMove: boolean | null;
    turns: number;
    opponentNickname: string;
    winner: 'X' | 'O' | null;
    isGameFinished: boolean;
}   

const initialState: GameState = {
    score: {
        playerX: 0,
        playerO: 0,
    },
    waitingForRematch: false,
    nickname: `guest-${crypto.randomUUID().substring(1, 5)}`,
    amIX: true,
    isXMove: true,
    turns: 0,
    opponentNickname: 'opponent',
    winner: null,
    isGameFinished: false,
}

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setScore: (state, action:PayloadAction<ScoreT>) => {
            state.score = action.payload;
        },
        setWaitingForRematch: (state, action:PayloadAction<boolean>) => {
            state.waitingForRematch = action.payload;
        },
        setNickname: (state, action:PayloadAction<string>) => {
            state.nickname = action.payload;
        },
        setAmIX: (state, action:PayloadAction<boolean>) => {
            state.amIX = action.payload;
        },
        setIsXMove: (state, action:PayloadAction<boolean>) => {
            state.isXMove = action.payload;
        },
        setTurns: (state, action:PayloadAction<number>) => {
            state.turns = action.payload;
        },
        setOpponentNickname: (state, action:PayloadAction<string>) => {
            state.opponentNickname = action.payload;
        },
        setWinner: (state, action:PayloadAction<'X' | 'O' | null>) => {
            state.winner = action.payload;
        },
        setIsGameFinished: (state, action:PayloadAction<boolean>) => {
            state.isGameFinished = action.payload;
        },
    }
});

export const { setScore, setWinner, setIsGameFinished, setOpponentNickname, setTurns, setIsXMove, setAmIX, setWaitingForRematch, setNickname } = gameSlice.actions;

export default gameSlice.reducer;