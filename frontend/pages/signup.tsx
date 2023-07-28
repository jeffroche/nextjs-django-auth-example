import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../auth';

const loginApi = async (email: string, password: string): Promise<void> => {
	const resp = await fetch('/api/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password })
	});
	if (resp.status !== 200) {
		throw new Error(await resp.text());
	}
	Router.push('/me');
};

const Login = () => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	function togglePasswordVisibility() {
		setIsPasswordVisible((prevState) => !prevState);
	}
	const { loading, register } = useAuth();

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault();
		setErrorMessage('');
		try {
			const resp = await register(email, password);
			if (resp.status === 401) {
				setErrorMessage('Invalid login credentials');
			}
		} catch (error) {
			console.error(error);
			// TODO: actually parse api 400 error messages
			setErrorMessage(error.message);
		}
	};

	// if (!loading && isAuthenticated) Router.push('/');

	return (
		<Layout>
			<form className="w-full max-w-sm pt-4" onSubmit={handleSubmit}>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							htmlFor="email"
						>
							Email
						</label>
					</div>
					<div className="md:w-2/3">
						<input
							type="email"
							placeholder="Email Address"
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="email"
							name="email"
							value={email}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setEmail(e.target.value)
							}
						/>
					</div>
				</div>
				<div className="md:flex md:items-center mb-6">
					<div className="md:w-1/3">
						<label
							className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
							htmlFor="password"
						>
							Password
						</label>
					</div>
					<div className="md:w-2/3 relative container mx-auto">
						<input
							type={isPasswordVisible ? 'text' : 'password'}
							placeholder="Password"
							className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="password"
							name="password"
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setPassword(e.target.value)
							}
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
							onClick={togglePasswordVisibility}
						>
							{isPasswordVisible ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
									/>
								</svg>
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
				<div className="md:flex md:items-center">
					<div className="md:w-1/3"></div>
					<div className="md:w-2/3">
						<button
							className="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							type="submit"
						>
							Register
						</button>
					</div>
				</div>
				{errorMessage ? (
					<div className="md:flex md:items-center">
						<div className="md:w-1/3"></div>
						<div className="md:w-2/3 pt-4">
							<p className="text-red-400">Error: {errorMessage}</p>
						</div>
					</div>
				) : null}
				<div className="md:flex md:items-center">
					<div className="md:w-1/3"></div>
					<div className="md:w-2/3 pt-4">
						<p className="text-gray-700">
							Already have an account?{' '}
							<Link className="text-teal-400" href="/login">
								Login
							</Link>
							.
						</p>
					</div>
				</div>
			</form>
		</Layout>
	);
};

export default Login;
