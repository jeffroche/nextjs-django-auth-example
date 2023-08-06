'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from './Sidebar';

export const MobileSidebar = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Sheet>
			<SheetTrigger>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0">
				<Sidebar />
			</SheetContent>
		</Sheet>
	);
};
