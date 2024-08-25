import { ParamType } from "../types/httpRequest";
import { StudentType } from "./Students.type";
import { TeacherType } from "./Teacher.type";

 interface PersonalInfo {
    dateOfBirth?: string;
    ethnicity?: string;
    religion?: string;
    idNumber?: string;
    issuedDate?: string;
    issuedBy?: string;
    phone?: string;
    email?: string;
    birthPlace?: string;
    permanentResidence?: string;
    urlAvatar?:string
  }
  
   interface EducationInfo {
    status?: string;
    fileNumber?: string;
    admissionDate?: string;
    class?: string;
    campus?: string;
    degree?: string;
    trainingType?: string;
    faculty?: string;
    major?: string;
    specialization?: string;
    courseYear?: number;
  }
  

  interface StudentProfileType  {
    fullName?: string;
    gender?: string;
    education?: EducationInfo;
    personal?: PersonalInfo;
  }
interface userProfileType extends StudentProfileType
{ 
  id?: string;
  username?: string;
  password?: string;
  isGraduate?: number;
  //roles: Role[];
  teachers?: TeacherType;
  students?: StudentType;

}
  interface StudentProfileParamsType extends ParamType {
    fullName?: string;
    gender?: string;
    education?: EducationInfo;
    personal?: PersonalInfo;
  }

export type { StudentProfileParamsType, StudentProfileType,userProfileType };
