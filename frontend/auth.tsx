import React, { useState, useEffect, useContext } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_HOST;

interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
}

interface TokenResponse {
	access: string;
	access_expires: number;
}

export const makeUrl = (endpoint: string): string => {
	return API_BASE + endpoint;
};

const fetchToken = (email: string, password: string): Promise<Response> => {
	const url = makeUrl('/login/');
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
};
const newRegistrationToken = (
	email: string,
	password: string
): Promise<Response> => {
	const url = makeUrl('/register/');
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
};

const fetchNewToken = (): Promise<Response> => {
	const url = makeUrl('/token/refresh/');
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});
};

async function fetchUser(token: string): Promise<Response> {
	const url = makeUrl('/me/');
	return fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

type AuthContextProps = {
	isAuthenticated: boolean;
	loading: boolean;
	user: User | null;
	login: (email: string, password: string) => Promise<Response>;
	logout: () => void;
	getToken: () => Promise<string>;
	sidebarOpen: boolean;
	setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthContext = React.createContext<Partial<AuthContextProps>>({});

interface AuthProviderProps {
	children: React.ReactNode;
}

export const AuthProvider = ({
	children
}: AuthProviderProps): React.ReactNode => {
	const [loading, setLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string>('');
	const [accessTokenExpiry, setAccessTokenExpiry] = useState<number | null>(
		null
	);

	const setNotAuthenticated = (): void => {
		setIsAuthenticated(false);
		setLoading(false);
		setUser(null);
	};

	const accessTokenIsValid = (): boolean => {
		if (accessToken === '' || !accessTokenExpiry) {
			return false;
		}
		const expiry = new Date(accessTokenExpiry);
		return expiry.getTime() > Date.now();
	};

	const initAuth = async (): Promise<void> => {
		setLoading(true);
		if (!accessTokenIsValid()) {
			await refreshToken();
		} else {
			setIsAuthenticated(true);
			setLoading(false);
		}
	};

	useEffect(() => {
		initAuth();
	}, []);

	const initUser = async (token: string): Promise<void> => {
		const resp = await fetchUser(token);
		const user = await resp.json();
		setUser(user);
	};

	const refreshToken = async (): Promise<string> => {
		setLoading(true);
		const resp = await fetchNewToken();
		if (!resp.ok) {
			setNotAuthenticated();
			return '';
		}
		const tokenData = await resp.json();
		handleNewToken(tokenData);
		if (user === null) {
			await initUser(tokenData.access);
		}
		return tokenData.access;
	};

	const handleNewToken = (data: TokenResponse): void => {
		setAccessToken(data.access);
		const expiryInt = data.access_expires * 10000;
		setAccessTokenExpiry(expiryInt);
		setIsAuthenticated(true);
		setLoading(false);
	};

	const login = async (email: string, password: string): Promise<Response> => {
		const resp = await fetchToken(email, password);
		if (resp.ok) {
			const tokenData = await resp.json();
			handleNewToken(tokenData);
			await initUser(tokenData.access);
		} else {
			setIsAuthenticated(false);
			setLoading(true);
			// Let the page handle the error
		}
		return resp;
	};

	const register = async (
		email: string,
		password: string
	): Promise<Response> => {
		const resp = await newRegistrationToken(email, password);
		if (resp.ok) {
			const tokenData = await resp.json();
			console.log('tokenData from register', tokenData);
			handleNewToken(tokenData);
			await initUser(tokenData.access);
		} else {
			setIsAuthenticated(false);
			setLoading(true);
			// Let the page handle the error
		}
		return resp;
	};

	const getToken = async (): Promise<string> => {
		// Returns an access token if there's one or refetches a new one
		if (accessTokenIsValid()) {
			console.log('Getting access token.. existing token still valid');
			return Promise.resolve(accessToken);
		} else if (loading) {
			while (loading) {
				console.log('Getting access token.. waiting for token to be refreshed');
			}
			// Assume this means the token is in the middle of refreshing
			return Promise.resolve(accessToken);
		} else {
			console.log('Getting access token.. getting a new token');
			const token = await refreshToken();
			return token;
		}
	};

	const logout = (): void => {
		setAccessToken('');
		setAccessTokenExpiry(null);
		setNotAuthenticated();
		const url = makeUrl('/token/logout/');
		fetch(url, {
			method: 'POST',
			credentials: 'include'
		});
		// TODO: call endpoint to delete cookie
	};

	const value = {
		accessToken,
		getToken,
		isAuthenticated,
		loading,
		login,
		logout,
		sidebarOpen,
		setSidebarOpen,
		register,
		user
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): any => useContext(AuthContext);
