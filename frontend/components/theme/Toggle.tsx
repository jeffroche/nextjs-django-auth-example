'use client';

import React, { useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ThemeContext } from './ThemeContext';

const Toggle = () => {
	const { theme, setTheme } = useContext(ThemeContext);

	return (
		<div
			className="transition duration-500 ease-in-out rounded-full p-2"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			{theme === 'dark' ? (
				<Moon color="#52525b" className=" text-2xl cursor-pointer" />
			) : (
				<Sun color="#52525b" className=" text-2xl cursor-pointer" />
			)}
		</div>
	);
};

export default Toggle;
