import { ParamType } from '@/assets/types/httpRequest';
import { GeneralType } from './';

interface MajorType extends GeneralType {
    industryId?: string;
}

interface MajorParamType extends ParamType {
    isGetIndustry?: boolean;
    isGetDean?: boolean;
    industryId?: string | number;
}

export type { MajorParamType, MajorType };
