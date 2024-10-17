import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';
import { StudentType, TeacherType } from '.';

interface PointType extends GeneralType {
    scores?: {
        pointId: number;
        score: number;
        teacher: TeacherType;
        type: string;
    }[];
    averageScore?: number;
    studentJoin?: {
        student: StudentType;
    };
    studentJoinId?: number;
    teacherId?: number;
    point?: number;
    type?: string;
  
}

interface PointParamType extends ParamType {
    isGetThesisCurrentMe?: boolean;
    thesisId?: number;
    isGetPointMe?: boolean;
}

export type { PointParamType, PointType };
