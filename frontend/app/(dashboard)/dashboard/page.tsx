'use client';

import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card } from '../../../components/ui/card';
import { cn } from '../../../lib/utils';

import { tools } from '../../../constants';

export default function HomePage() {
	const router = useRouter();

	return (
		<div>
			<div className="mb-8 space-y-4">
				<h2 className="text-2xl md:text-4xl font-bold text-center">
					Unlock Your True Potential
				</h2>
				<p className="text-muted-foreground font-light text-sm md:text-lg text-center">
					Find the perfect pacer to your next PR.
				</p>
			</div>
			<div className="px-4 md:px-20 lg:px-32 space-y-4">
				{tools.map((tool) => (
					<Card
						onClick={() => router.push(tool.href)}
						key={tool.href}
						className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
					>
						<div className="flex items-center gap-x-4">
							<div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
								<tool.icon className={cn('w-8 h-8', tool.color)} />
							</div>
							<div className="font-semibold">{tool.label}</div>
						</div>
						<ArrowRight className="w-5 h-5" />
					</Card>
				))}
			</div>
		</div>
	);
}
