interface AuthType {
    aud: string;
    customer: {
        Id: number;
        Name: string;
    };
    exp: number;
    faculty: {
        Id: number;
    };
    permission: string[];
    type: string;
    uid: number;
    userName: string;

    // is_graduate:boolean;
    // createdate:Date;
    //  modifideddate:Date;
    //  username: string;
    //  password:string;
    //  createdby:AuthType;
    //  modifiedby:AuthType;



}

export type { AuthType };
