import { Code, ImageIcon, MessageSquare, Music, VideoIcon } from 'lucide-react';

export const tools = [
	{
		label: 'Conversation',
		icon: MessageSquare,
		href: '/conversation',
		color: 'text-violet-500',
		bgColor: 'bg-violet-500/10'
	},
	{
		label: 'Music Generation',
		icon: Music,
		href: '/music',
		color: 'text-emerald-500',
		bgColor: 'bg-emerald-500/10'
	},
	{
		label: 'Image Generation',
		icon: ImageIcon,
		color: 'text-pink-700',
		bgColor: 'bg-pink-700/10',
		href: '/image'
	},
	{
		label: 'Video Generation',
		icon: VideoIcon,
		color: 'text-orange-700',
		bgColor: 'bg-orange-700/10',
		href: '/video'
	},
	{
		label: 'Code Generation',
		icon: Code,
		color: 'text-green-700',
		bgColor: 'bg-green-700/10',
		href: '/code'
	}
];
