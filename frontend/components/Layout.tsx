import { useState } from 'react';
import { useAuth } from '../auth';
import Link from 'next/dist/client/link';

const Layout = ({ children }): React.ReactElement => {
	const { isAuthenticated } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	return (
		<div className="flex overflow-x-hidden h-screen sticky top-0 z-10 bg-green-500 shadow-md ">
			{sidebarOpen && (
				<aside
					className={`flex-shrink-0 w-64 flex flex-col border-r transition-all duration-300 ${
						sidebarOpen ? 'w-64' : 'w-0'
					}`}
				>
					{/* <div className="h-64 bg-gray-900"></div> */}
					<nav className="flex-1 flex flex-col bg-gray-900">
						{isAuthenticated ? (
							<Link href="/me">
								<a className="text-teal-200 hover:text-white mr-4">Profile</a>
							</Link>
						) : null}
						<Link href="/ping">
							<a className="text-teal-200 hover:text-white mr-4">Ping</a>
						</Link>
						<Link href="/about">
							<a className="text-teal-200 hover:text-white">About</a>
						</Link>
						{isAuthenticated ? (
							<Link href="/logout">
								<a className="inline-block text-sm md:text-lg px-4 py-2 leading-none rounded text-gray-200 hover:border-gray-200 hover:bg-gray-800 mt-4 lg:mt-0">
									Logout
								</a>
							</Link>
						) : (
							<Link href="/login">
								<a className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
									Login
								</a>
							</Link>
						)}
					</nav>
				</aside>
			)}
			<div className="flex-1">
				<header className="flex items-center p-4 text-semibold text-gray-100 bg-gray-900">
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
						<a>
							<div className="flex items-center flex-shrink-0 text-gray-200 mr-6">
								<span className="font-semibold text-6xl tracking-tight ">
									Do Do Brew
								</span>
							</div>
						</a>
					</Link>
				</header>
				<main className="h-screen bg-gray-800 h-scroll overflow-y-auto p-4">
					{children}
				</main>
			</div>
		</div>
	);
};

export default Layout;
