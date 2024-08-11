import { ParamType } from "../types/httpRequest";
import { GeneralType } from "./GeneralType.type";


interface DepartmentType extends GeneralType {
    facultyId?: string;
}

interface DepartmentParamType extends ParamType {
    isGetHeadDepartment?: boolean;
    isGetFaculty?: boolean;
}

export type { DepartmentType, DepartmentParamType };
