import { roleE } from "@/assets/configs/general";
import { Draft, createAction, createReducer } from "@reduxjs/toolkit";

export const setRoleE = createAction<roleE[]>("role/set")
export const deleteRoleE = createAction("role/delete")

const initState: { role: roleE[] } = {
    role: []
}

// nếu bạn muốn thêm midllwer thì làm như này :
// export const addProductInCart = createAction("productInCart/insert", (product: product) => {
//     return {
//         payload: {
//             ...product,
//             /// handle gì đó ở đây tùy
//         }
//     }
// })
const roleReducer = createReducer(initState, (builder) => {
    builder.addCase(setRoleE, (state, action) => {
        state.role = action.payload
    }).addCase(deleteRoleE, (state, action) => {
        state.role = initState.role
    })

}
)
export default roleReducer