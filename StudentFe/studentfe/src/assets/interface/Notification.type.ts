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

interface NotificationTypeInvitationInsertInput  {
    isSendAllStudent?: boolean;
    studentIds?: number[];
  }
interface NotificationParamType extends ParamType {
}

export type { NotificationParamType, NotificationType,NotificationTypeInvitationInsertInput };
