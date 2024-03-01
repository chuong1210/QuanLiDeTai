import { OptionType } from './common';

interface signInSliceType {
	account: string;
	password: string;
	rememberPassword?: boolean; // tu them
	token?: string;
	userName: string;
}

interface MenuSliceType {
	activeItem?: string;
	openMenu?: boolean;
	parent?: string;
}


export type { signInSliceType, MenuSliceType };
