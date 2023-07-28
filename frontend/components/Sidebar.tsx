'use client';

import Link from 'next/link';
import React, { useContext } from 'react';
import Toggle from '../components/theme/Toggle';

import {
	Bold,
	BookOpen,
	Headphones,
	LayoutDashboard,
	LogOut,
	Search,
	Settings,
	Star,
	Sun
} from 'lucide-react';
import { cn } from '../lib/utils';
import { usePathname } from 'next/navigation';
import { ThemeContext } from './theme/ThemeContext';
import { useClerk } from '@clerk/nextjs';

const upperRoutes = [
	{
		label: 'Dashboard',
		icon: LayoutDashboard,
		href: '/dashboard',
		color: 'text-zinc-600',
		selectedColor: '#FF80E5FF'
	},
	{
		label: 'Browse Events',
		icon: Search,
		href: '/search',
		color: '#52525b',
		selectedColor: '#FF80E5FF'
	},
	{
		label: 'My Events',
		icon: Star,
		href: '/my-events',
		color: '#52525b',
		selectedColor: '#FF80E5FF'
	},
	{
		label: 'Blog',
		icon: BookOpen,
		href: '/blog',
		color: '#52525b',
		selectedColor: '#FF80E5FF'
	},
	{
		label: 'Settings',
		icon: Settings,
		href: '/settings',
		color: '#52525b',
		selectedColor: '#FF80E5FF'
	}
];

const lowerRoutes = [
	{
		label: 'Help Center',
		icon: Headphones,
		href: '/help',
		color: '#52525b'
	}
];

const Sidebar = () => {
	const pathname = usePathname();
	const { theme, setTheme } = useContext(ThemeContext);
	const { signOut } = useClerk();
	return (
		<nav className="flex flex-col justify-between h-full px-2 border-r-2">
			<div className="flex-shrink-0 space-y-4 px-2 ">
				{upperRoutes.map((route) => (
					<Link
						key={route.href}
						href={route.href}
						className={cn(
							'text-sm group flex m-3 w-full justify-start font-medium cursor-pointer transition 300 hover:text-black dark:hover:text-white rounded-lg ',
							pathname === route.href
								? 'text-zinc-900 dark:text-white text-lg font-semibold'
								: 'text-zinc-400'
						)}
					>
						<div className="flex items-center flex-1 space-x-4">
							<route.icon
								color={pathname === route.href ? route.selectedColor : route.color}
								size={42}
								className={
									pathname === route.href
										? 'p-2 bg-gradient-to-t from-[#2A7FFFFF] to-white shadow-lg  rounded-xl '
										: 'p-2'
								}
							/>
							<p>{route.label}</p>
						</div>
					</Link>
				))}
				<hr className="border-t[0.1px] border-zinc-400 mx-5" />

				<div
					className={
						'text-sm group flex m-3 w-full justify-start font-medium cursor-pointer transition 300 hover:text-black dark:hover:text-white text-zinc-400'
					}
				>
					<div
						className="flex items-center flex-1 space-x-4"
						onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
					>
						<Toggle />
						<p>{`${theme === 'dark' ? 'Dark' : 'Light'} Mode`}</p>
					</div>
				</div>
			</div>
			<div className="flex flex-grow flex-col justify-end space-y-4 px-2 mb-3">
				<Link
					href="/help"
					className="text-sm group flex m-3 w-full items-center font-medium cursor-pointer transition 300 hover:text-black dark:hover:text-white rounded-lg text-zinc-400 "
				>
					<Headphones color="#52525b" size={42} className="p-2" />
					<p>Support</p>
				</Link>
				<div
					className="text-sm group flex m-3 w-full items-center font-medium cursor-pointer transition 300 hover:text-black dark:hover:text-white rounded-lg text-zinc-400 "
					onClick={() => signOut()}
				>
					<LogOut color="#52525b" size={42} className="p-2" />
					<p>Logout</p>
				</div>
			</div>

			<hr className="border-t[0.1px] border-zinc-900 dark:border-zinc-400" />
		</nav>
	);
};

export default Sidebar;
