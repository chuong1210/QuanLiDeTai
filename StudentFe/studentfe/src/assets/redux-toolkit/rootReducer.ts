import menuSlice from './slices/menu/slice';
import userSlice from './slices/menu/userSlice';

export const reducer = {
	menu: menuSlice.reducer,
	auth: userSlice.reducer,
};
