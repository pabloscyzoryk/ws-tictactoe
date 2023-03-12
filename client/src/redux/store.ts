import { configureStore } from "@reduxjs/toolkit";
import gameReducer from './game';
import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    game: gameReducer,
})

export default configureStore({
    reducer: {
     game: gameReducer,
    },
});

export type RootState = ReturnType<typeof rootReducer>