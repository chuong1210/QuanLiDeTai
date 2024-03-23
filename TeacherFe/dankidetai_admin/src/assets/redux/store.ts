import { configureStore } from "@reduxjs/toolkit"
import roleReducer from "./role/role.reducer"
export const store = configureStore({
    // add reducer in here
    reducer: { role: roleReducer }
})
export type Rootstate = ReturnType<typeof store.getState>
export type Appdispatch = typeof store.dispatch
