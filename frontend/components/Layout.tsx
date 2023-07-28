'use client';

import { useState } from 'react';
import { useAuth } from '../auth';
import Link from 'next/dist/client/link';
import {
	BellIcon,
	LogoutIcon,
	LoginIcon,
	UserCircleIcon,
	UserIcon,
	ShieldCheckIcon,
	InformationCircleIcon
} from '@heroicons/react/outline';

const Layout = ({ children }): React.ReactElement => {
	const { isAuthenticated, sidebarOpen, setSidebarOpen } = useAuth();
	return (
		<div className="bg-zinc-800 text-slate-300 flex flex-col min-h-screen md:flex-row">
			{sidebarOpen && (
				<nav className="space-y-1 w-full md:w-1/6 border-r-[0.1px] border-r-slate-400 p-2">
					{isAuthenticated ? (
						<>
							<Link
								href="/me"
								className="flex items-center p-2  font-normal rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition duration-200"
							>
								<UserIcon className="w-6 h-6" />
								<span className="ml-3">Profile</span>
							</Link>
							<Link
								href="/races"
								className="flex items-center p-2  font-normal rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition duration-200"
							>
								<ShieldCheckIcon className="w-6 h-6" />
								<span className="ml-3">Races</span>
							</Link>
						</>
					) : null}
					<Link
						href="/ping"
						className="flex items-center p-2  font-normal rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition duration-200"
					>
						<BellIcon className="w-6 h-6" />
						<span className="ml-3">Ping</span>
					</Link>
					<Link
						href="/about"
						className="flex items-center p-2  font-normal rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition duration-200"
					>
						<InformationCircleIcon className="w-6 h-6" />
						<span className="ml-3">About</span>
					</Link>
					<hr className="border-t[0.1px] border-zinc-400" />
					{isAuthenticated ? (
						<Link
							href="/logout"
							className="flex items-center p-2  font-normal rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition duration-200"
						>
							<>
								<LogoutIcon className="w-6 h-6" />
								<span className="ml-3">Logout</span>
							</>
						</Link>
					) : (
						<Link
							href="/login"
							className="flex items-center p-2  font-normal rounded-lg text-zinc-500 hover:bg-zinc-700 hover:text-white transition duration-200"
						>
							<>
								<LoginIcon className="w-6 h-6" />
								<span className="ml-3">Login</span>
							</>
						</Link>
					)}
				</nav>
			)}
			<div className="flex-1 h-screen relative p-5 text-xs md:text-sm">
				<header className="flex items-center p-4 text-semibold text-gray-100 sticky top-0 z-10">
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
						<div className="flex items-center space-x-2 flex-shrink-0 mr-6">
							<img src="pace-my-race-logo.svg" alt="Race My Pace" className="h-20" />
						</div>
					</Link>
				</header>

				<div className="flex-grow w-full">{children}</div>
			</div>
		</div>
	);
};

export default Layout;
