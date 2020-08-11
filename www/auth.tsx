import React, { useState, useEffect, useContext } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_HOST;
const ACCESS_TOKEN_STORAGE_KEY = "appAccessToken";
const ACCESS_TOKEN_EXPIRY_STORAGE_KEY = "appAccessTokenExpiry";
const REFRESH_TOKEN_STORAGE_KEY = "appRefreshToken";
const REFRESH_TOKEN_EXPIRY_STORAGE_KEY = "appRefreshTokenExpiry";

const makeUrl = (endpoint: string): string => {
  return API_BASE + endpoint;
}

const fetchToken = (username: string, password: string): Promise<Response> => {
  const url = makeUrl("/token/");
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const fetchNewToken = (): Promise<Response> => {
  const url = makeUrl("/token/refresh/");
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

async function fetchUser(token: string): Promise<Response> {
  const url = makeUrl("/me/")
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
}

type AuthContextProps = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<Response>;
  logout: () => void;
}

const AuthContext = React.createContext<Partial<AuthContextProps>>({});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): React.ReactNode => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [accessTokenExpiry, setAccessTokenExpiry] = useState<string>("");

  const setNotAuthenticated = (): void => {
    setIsAuthenticated(false);
    setLoading(false);
    setUser(null);
  };

  const accessTokenIsValid = (): boolean => {
    if (accessToken === "") {
      return false;
    }
    const expiry = new Date(accessTokenExpiry);
    return expiry.getTime() < Date.now();
  }

  const initAuth = async (): Promise<void> => {
    setLoading(true);
    if (!accessTokenIsValid()) {
      console.log("Invalid access token so refetching")
      // fetch a new token using the refresh token
      const resp = await fetchNewToken();
      if (!resp.ok) {
        setNotAuthenticated();
        return;
      }
      const tokenData = await resp.json();
      setAccessToken(tokenData.access);
      setAccessTokenExpiry(tokenData.access_expires);
    }
    setIsAuthenticated(true);
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const initUser = async (): Promise<void> => {
    if (isAuthenticated && user === null) {
      const resp = await fetchUser(accessToken);
      const user = await resp.json();
      setUser(user);
    }
  }

  useEffect(() => {
    initUser();
  }, [isAuthenticated]);

  const login = async (username: string, password: string): Promise<Response> => {
    const resp = await fetchToken(username, password);
    if (resp.ok) {
      const tokenData = await resp.json();
      setAccessToken(tokenData.access);
      setAccessTokenExpiry(tokenData.access_expires);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(true);
      // Let the page handle the error
    }
    return resp;
  };

  const logout = (): void => {
    setAccessToken("");
    setAccessTokenExpiry(null);
    setNotAuthenticated();
    const url = makeUrl("/token/logout/");
    fetch(url, {
      method: "POST",
    });
    // TODO: call endpoint to delete cookie
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): any => useContext(AuthContext);