import { configureStore } from "@reduxjs/toolkit"
export const store = configureStore({
    // add reducer in here
    reducer: {}
})
export type Rootstate = ReturnType<typeof store.getState>
export type Appdispatch = typeof store.dispatch