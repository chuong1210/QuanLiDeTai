import { ParamType } from "../types/httpRequest";
import { GeneralType } from "./GeneralType.type";
import { StudentType } from "./Students.type";

interface Role extends GeneralType {

  code?: string;
}
interface AuthType extends GeneralType {

    username: string;
    isGraduate?:number
    roles: Role[];
    type: string;
    student?: StudentType;






}

interface AuthTypeParamType extends ParamType {
  userName?:string 
}

interface AuthTypeLogin {
    accessToken:string ;
    refreshToken?:string;
}

interface AuthTypeRefreshToken {
token?:string;
}


export type { AuthType,AuthTypeLogin,AuthTypeRefreshToken,AuthTypeParamType };
