interface AuthType {

    aud: string;
    result: {
        Id: number;
        Name: string;
    };
    faculty: {
        Id: number;
    };
    permission: string[];
    type: string;
    userName: string;





}

interface AuthTypeLogin {
     accessToken:string ;
    refreshToken?:string;
}


export type { AuthType,AuthTypeLogin };
