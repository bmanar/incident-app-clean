import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Optionnel : stocker en localStorage pour garder la session après refresh
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const login = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}
