import { ParamType } from "../types/httpRequest";
import { DepartmentType } from "./Department";
import { GeneralType } from "./GeneralType.type";


interface FacultyDutyType extends GeneralType {
    facultyId?: string;
    departmentId?: number;
    departments?: DepartmentType;
    numberOfThesis?: string | number;
    timeStart?: Date | null;
    timeEnd?: Date | null;
    image?: string;
    images?: string[];
    file?: string;
}

interface FacultyDutyParamType extends ParamType {
    isGetDepartment?: boolean;
    isGetFaculty?: boolean;
}

export type { FacultyDutyType, FacultyDutyParamType };
