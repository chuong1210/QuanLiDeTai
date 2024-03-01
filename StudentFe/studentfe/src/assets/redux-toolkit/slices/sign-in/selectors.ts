import type { ReduxState } from '@/assets/redux-toolkit';

export const selectSignIn = (state: ReduxState) => state.signIn;
