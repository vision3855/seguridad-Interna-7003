import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";

// 1. Capitalized for component-style usage
const UserContext = createContext();

async function fetchUser() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    const response = await axios.get(
      "https://segintco7003.onrender.com/api/auth/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [login, setLogin] = useState(false);

  const refreshUser = async () => {

      const data = await fetchUser();
      setUser(data);
      setLoading(false);
      setLogin(true)

  };

  // Run once on mount so the user doesn't have to manually trigger "setActiveUser"
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      refreshUser();
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, refreshUser, login, setLogin }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
