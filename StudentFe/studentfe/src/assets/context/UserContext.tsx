import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { AuthType } from "@/assets/interface";

interface UserContextType {
  user: AuthType | null;
  setUser: (user: AuthType | null) => void;
  hasGroup: boolean;
  setHasGroup: (hasGroup: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthType | null>(null);
  const [hasGroup, setHasGroup] = useState<boolean>(false);

  // Fetch user and hasGroup from localStorage on component mount and when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      const storedHasGroup = localStorage.getItem("hasGroup");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (storedHasGroup) {
        setHasGroup(JSON.parse(storedHasGroup));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange(); // Fetch initial data

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, hasGroup, setHasGroup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
