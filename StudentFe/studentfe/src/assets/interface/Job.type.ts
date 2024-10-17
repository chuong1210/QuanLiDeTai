import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType, TeacherType } from '.';
import { FileType } from '@/assets/types/form';

interface JobType extends GeneralType {
    instructions?: string;
    due?: Date;
    files?: FileType[];
    lastModifiedDate?: Date;
    teacherBy?: TeacherType;
    thesisId?: number;
    from: Date;             
    senderId: string;       
    name: string;          
    description: string;    // Kiểu chuỗi cho mô tả
    detail: string;         // Kiểu chuỗi cho chi tiết
    isCompleted: number;
}

interface JobParamType extends ParamType {
    thesisId?: number;
    groupId?:number
}

export type { JobParamType, JobType };
