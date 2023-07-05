'use client';

import { useState } from 'react';
import { useAuth } from '../auth';
import Link from 'next/dist/client/link';
import { LogoutIcon, LoginIcon } from '@heroicons/react/outline';

const Layout = ({ children }): React.ReactElement => {
	const { isAuthenticated } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	return (
		<div className="flex ">
			{sidebarOpen && (
				<div className="h-screen px-3 pb-4 relative space-y-4 text-zinc-900 dark:text-zinc-500 p-5 text-xs md:text-sm  border-zinc-600 w-64 border-2">
					<nav className="space-y-1">
						{isAuthenticated ? (
							<>
								<Link
									href="/me"
									className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
								>
									Profile
								</Link>
								<Link
									href="/coffee"
									className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
								>
									Coffee
								</Link>
								<Link
									href="/brands"
									className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
								>
									Brands
								</Link>
							</>
						) : null}
						<Link
							href="/ping"
							className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
						>
							Ping
						</Link>
						<Link
							href="/about"
							className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
						>
							About
						</Link>
						<hr className="border-t[0.1px] border-zinc-900 dark:border-zinc-400" />
						{isAuthenticated ? (
							<Link
								href="/logout"
								className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
							>
								<>
									<LogoutIcon className="w-6 h-6" />
									<span className="ml-3">Logout</span>
								</>
							</Link>
						) : (
							<Link
								href="/login"
								className="flex items-center p-2  font-normal text-zinc-900 rounded-lg dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-green-500 dark:hover:text-white transition duration-200"
							>
								<>
									<LoginIcon className="w-6 h-6" />
									<span className="ml-3">Login</span>
								</>
							</Link>
						)}
					</nav>
				</div>
			)}
			<div className="flex-1">
				<header className="flex items-center p-4 text-semibold text-gray-100 bg-gray-900 sticky top-0 z-10">
					<button className="p-1 mr-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
					<Link href="/">
						<div className="flex items-center space-x-2 flex-shrink-0 text-gray-200 mr-6">
							<img
								src="Coffee-Cup-Silhouette.svg"
								alt="Coffee Cup"
								className="h-20 w-20 rounded-full bg-gradient-to-tr from-stone-500 to-gray-300"
							/>
							<span className="flex items-center font-semibold text-6xl ">
								Do Do Brew
							</span>
						</div>
					</Link>
				</header>

				<div className="flex-grow w-full p-4">{children}</div>
			</div>
		</div>
	);
};

export default Layout;
