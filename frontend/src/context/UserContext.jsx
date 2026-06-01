import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("hw_user_token");
    if (!token) { setLoading(false); return; }
    axios.get("/api/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setUser(r.data))
      .catch(() => { localStorage.removeItem("hw_user_token"); localStorage.removeItem("hw_user"); })
      .finally(() => setLoading(false));
  }, []);

  const loginUser = (token, userData) => {
    console.log('UserContext - loginUser called with:', { token: token ? 'exists' : 'missing', userData });
    localStorage.setItem("hw_user_token", token);
    localStorage.setItem("hw_user", JSON.stringify(userData));
    setUser(userData);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log('UserContext - login complete, user set in state');
  };

  const logoutUser = () => {
    localStorage.removeItem("hw_user_token");
    localStorage.removeItem("hw_user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = (data) => setUser(prev => ({ ...prev, ...data }));

  return (
    <UserContext.Provider value={{ user, loading, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
