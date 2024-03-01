import type { ReduxState } from '@/assets/redux-toolkit';

const selectMenu = (state: ReduxState) => state.menu;

export { selectMenu };
