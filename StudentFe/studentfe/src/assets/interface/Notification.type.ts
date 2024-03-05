import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from '.';
import { FileType } from '@/assets/types/form';

interface NotificationType extends GeneralType {
    describe?: string;
    content?: string;
    image?: FileType;
    lastModifiedDate?: Date;
    images?: FileType[];
}

interface NotificationParamType extends ParamType {
}

export type { NotificationParamType, NotificationType };
