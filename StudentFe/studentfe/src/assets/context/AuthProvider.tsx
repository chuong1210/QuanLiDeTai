import { createContext, ReactNode, useState } from "react";
import { PageProps } from "../types/UI";
import { AuthType } from "../interface/AuthType.type";

interface AuthContextProps {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const initialAuth: AuthType = {
  id: 0,
  username: "",
  roles: [],
  type: "",
  students: {},
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
