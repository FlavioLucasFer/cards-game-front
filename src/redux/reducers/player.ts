import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Player {
    id: number;
    gameId: number;
    nickname: string;
    createdAt: string;
    updatedAt: string;
}

const initialState = {
    id: 0,
    gameId: 0,
    nickname: '',
    createdAt: '',
    updatedAt: '',
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<Player>) => {
            const {
                id,
                gameId,
                nickname,
                createdAt,
                updatedAt,
            } = action.payload;

            state.id = id;
            state.gameId = gameId;
            state.nickname = nickname;
            state.createdAt = createdAt;
            state.updatedAt = updatedAt;
        },
    },
});

export const { setPlayer } = playerSlice.actions;

export default playerSlice.reducer;
