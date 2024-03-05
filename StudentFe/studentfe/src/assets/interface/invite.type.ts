import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType, GroupType } from '.';

interface InviteType extends GeneralType {
    message: string;
    studentJoinId: number;
    timeSent?: Date;
    groupId?: number;
    group?: GroupType;
}

interface InviteParamType extends ParamType {
    isGetGroup?: boolean;
}

export type { InviteType, InviteParamType };
