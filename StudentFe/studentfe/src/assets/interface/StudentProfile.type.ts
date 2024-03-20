import { ParamType } from "../types/httpRequest";

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
  

  interface StudentProfileType {
    mssv?: string;
    fullName?: string;
    gender?: string;
    education?: EducationInfo;
    personal?: PersonalInfo;
  }

  interface StudentProfileParamsType extends ParamType {
    // studentId?: number;
    fullName?: string;
    gender?: string;
    education?: EducationInfo;
    personal?: PersonalInfo;
  }

export type { StudentProfileParamsType, StudentProfileType };
