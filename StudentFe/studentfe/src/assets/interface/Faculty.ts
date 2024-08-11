import { ParamType } from "../types/httpRequest";
import { DepartmentType } from "./Department";
import { GeneralType } from "./GeneralType.type";


interface FacultyType extends GeneralType {
    dean_TeacherId?: string;
    departments?:DepartmentType
}

interface FacultyParamType extends ParamType {
    isGetDepartment?: boolean;
    isGetDean?: boolean;
}

export type { FacultyType, FacultyParamType };
