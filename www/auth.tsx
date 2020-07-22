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

const fetchNewToken = (refreshToken: string): Promise<Response> => {
  const url = makeUrl("/token/refresh/");
  return fetch(url, {
    method: "POST",
    body: JSON.stringify({ refresh: refreshToken }), // eslint-disable-line @typescript-eslint/camelcase
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const ONE_HOUR = 60 * 60 * 1000;
const THIRTY_DAYS = ONE_HOUR * 24 * 30;

const storeTokens = (tokens: { access: string; refresh: string }): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.access);
  localStorage.setItem(ACCESS_TOKEN_EXPIRY_STORAGE_KEY, (Date.now() + ONE_HOUR).toString());
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refresh);
  localStorage.setItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY, (Date.now() + THIRTY_DAYS).toString());
};

const storeAccessToken = (access: string): void => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access);
  localStorage.setItem(ACCESS_TOKEN_EXPIRY_STORAGE_KEY, (Date.now() + ONE_HOUR).toString());
};

const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRY_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
};

const isExpired = (expiry: Date): boolean => {
  return expiry.getTime() < Date.now();
};

export const getOrFetchToken = async (): Promise<string> => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  const accessTokenExpiryString = localStorage.getItem(ACCESS_TOKEN_EXPIRY_STORAGE_KEY);
  const refreshTokenExpiryString = localStorage.getItem(REFRESH_TOKEN_EXPIRY_STORAGE_KEY);
  if (!accessToken || !refreshToken) {
    return Promise.reject("No tokens");
  }
  const accessTokenExpiry = accessTokenExpiryString
    ? new Date(parseInt(accessTokenExpiryString))
    : null;
  const refreshTokenExpiry = accessTokenExpiryString
    ? new Date(parseInt(refreshTokenExpiryString))
    : null;
  if (!isExpired(accessTokenExpiry)) {
    return Promise.resolve(accessToken);
  } else {
    if (!isExpired(refreshTokenExpiry)) {
      const resp = await fetchNewToken(refreshToken);
      const json = await resp.json();
      storeAccessToken(json.access);
      return json.access;
    } else {
      return Promise.reject("Refresh token expired");
    }
  }
};

async function fetchUser(): Promise<Response> {
  const url = makeUrl("/me/")
  const token = await getOrFetchToken();
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

  const setNotAuthenticated = (): void => {
    setIsAuthenticated(false);
    setLoading(false);
    setUser(null);
  };

  const initAuth = async (): Promise<void> => {
    setLoading(true);
    try {
      const resp = await fetchUser();
      const user = await resp.json();
      setUser(user);
    } catch (error) {
      console.log(error);
      setNotAuthenticated();
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (username: string, password: string): Promise<Response> => {
    const resp = await fetchToken(username, password);
    if (resp.ok) {
      const tokens = await resp.json();
      storeTokens(tokens);
      initAuth();
    } else {
      setIsAuthenticated(false);
      setLoading(true);
      // Let the page handle the error
    }
    return resp;
  };

  const logout = (): void => {
    clearTokens();
    setNotAuthenticated();
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