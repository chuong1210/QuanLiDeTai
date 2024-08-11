import { useContext, useDebugValue, useEffect } from "react";
import AuthContext from "../context/AuthProvider";

import refreshToken from "./useRefreshToken";


const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { auth } = authContext;
  useDebugValue(auth, auth => auth?.userName ? "Logged In" : "Logged Out");

  return authContext;
}

export default useAuth;



const useAuthCheck = () => {
  useEffect(() => {
     refreshToken().then(()=>{
      
     });
    if (!refreshToken) {
      window.location.href = '/login'; // Chuyển hướng tới trang đăng nhập nếu không có refreshToken
    }
  }, []);
};

