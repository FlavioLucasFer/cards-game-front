import { configureStore } from "@reduxjs/toolkit";
import playerReducer from './reducers/player';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem("http://localhost:3000:state");

        if (serializedState === null) {
            return {};
        }

        return JSON.parse(serializedState);
    }
    catch (err) {
        return {};
    }
}

export const store = configureStore({
    reducer: {
        player: playerReducer,
    },
    preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const saveState = (state: RootState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("http://localhost:3000:state", serializedState);
    }
    catch (err) {
        console.log('err:', err);
    }
}

store.subscribe(() => {
    saveState(store.getState());
});
