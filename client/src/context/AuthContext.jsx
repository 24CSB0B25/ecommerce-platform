import {
  createContext,
  useState,
} from "react";

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] = useState(() => {
    const userInfo =
        localStorage.getItem("userInfo");

    return userInfo
        ? JSON.parse(userInfo)
        : null;
    });

  const login = (data) => {
    localStorage.setItem(
      "userInfo",
      JSON.stringify(data)
    );

    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem(
      "userInfo"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};