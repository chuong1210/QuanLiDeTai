// slices/user/slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthType } from '@/assets/interface'; // Import your AuthType

export interface UserState {
  user: AuthType | null;
  hasGroup: boolean;
}

const initialState: UserState = {
  user: null,
  hasGroup: false,
};

 const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthType | null>) => {
      state.user = action.payload;
    },
    setHasGroup: (state, action: PayloadAction<boolean>) => {
      state.hasGroup = action.payload;
    },
  },
});

export const { setUser, setHasGroup } = userSlice.actions;
export default userSlice;