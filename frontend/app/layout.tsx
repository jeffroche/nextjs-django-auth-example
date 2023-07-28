import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import Background from '../components/theme/Background';
import { ThemeProvider } from '../components/theme/ThemeContext';

import './globals.css';

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Pace My Race',
	description: 'Run with a Pacer'
};

export default async function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider initialTheme={null}>
			<ClerkProvider>
				<html lang="en" suppressHydrationWarning>
					<Background>
						<body className={font.className}>{children}</body>
					</Background>
				</html>
			</ClerkProvider>
		</ThemeProvider>
	);
}
