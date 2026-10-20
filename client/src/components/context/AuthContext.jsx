
import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  login as loginService,
  logout as logoutService,
  getProfile,
} from "../services/auth.service";

export const AuthContext = createContext(null);

// =====================================================
// SAFELY READ STORED USER
// =====================================================

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Unable to read stored user:", error);

    localStorage.removeItem("user");

    return null;
  }
};

// =====================================================
// AUTH PROVIDER
// =====================================================

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = useCallback(() => {
    try {
      logoutService();
    } catch (error) {
      console.error("Logout service error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  }, []);

  // =====================================================
  // VALIDATE STORED SESSION
  // =====================================================

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        if (active) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }

        return;
      }

      try {
        const response = await getProfile();

        // Support common API response formats.
        const profile =
          response?.data?.user ||
          response?.data?.data?.user ||
          response?.data?.data ||
          response?.data;

        if (!profile || typeof profile !== "object") {
          throw new Error("Invalid user profile response.");
        }

        if (active) {
          setUser(profile);
          setToken(storedToken);

          localStorage.setItem(
            "user",
            JSON.stringify(profile)
          );
        }
      } catch (error) {
        console.error(
          "Session validation failed:",
          error?.response?.status || error?.message
        );

        if (active) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = useCallback(async (credentials) => {
    const response = await loginService(credentials);

    const responseData =
      response?.data?.data || response?.data;

    const newToken = responseData?.token;
    const loggedInUser = responseData?.user;

    if (!newToken || !loggedInUser) {
      throw new Error(
        "Login failed: token or user details were not received."
      );
    }

    localStorage.setItem("token", newToken);

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setToken(newToken);
    setUser(loggedInUser);

    return response;
  }, []);

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(token && user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
