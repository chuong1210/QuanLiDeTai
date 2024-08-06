import { createContext, ReactNode, useState } from "react";
import { PageProps } from "../types/UI";
import { AuthType } from "../interface/AuthType.type";

interface AuthContextProps {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const initialAuth: AuthType = {
  aud: "",
  result: {
    Id: 0,
    Name: "",
  },
  faculty: {
    Id: 0,
  },
  permission: [],
  type: "",
  userName: "",
};

export const AuthProvider = ({ children }: PageProps) => {
  const [auth, setAuth] = useState<AuthType>(initialAuth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
