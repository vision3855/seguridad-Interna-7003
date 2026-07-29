import axios from "axios";
import { createContext, useState, useContext, useEffect, useRef, useCallback } from "react";

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
  const [alertMessage, setAlertMessage] = useState({
    type: "inActive",
    message: "",
  });
  const alertTimerRef = useRef(null);

  const showAlert = useCallback((type, message, duration = 3000) => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
    }
    setAlertMessage({ type, message });
    if (duration > 0) {
      alertTimerRef.current = setTimeout(() => {
        setAlertMessage({ type: "inActive", message: "" });
        alertTimerRef.current = null;
      }, duration);
    }
  }, []);

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
      value={{ user, setUser, loading, refreshUser, login, setLogin, alertMessage, setAlertMessage, showAlert }}
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
