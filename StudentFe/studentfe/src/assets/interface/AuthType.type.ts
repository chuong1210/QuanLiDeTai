import { ParamType } from "../types/httpRequest";
import { GeneralType } from "./GeneralType.type";
import { StudentType } from "./Students.type";

interface AuthType extends GeneralType {

    username: string;
    isGraduate?:number
    roles: string[];
    type: string;
    students?: StudentType;






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
