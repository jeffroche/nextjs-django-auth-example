import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import JSXStyle from 'styled-jsx/style';

const BrandCard = ({ brand }): JSX.Element => {
	return (
		<Link href={`/brands/${brand.id}`}>
			<div className="text-3xl font-bold border-2 rounded-lg flex items-center justify-center p-5 cursor-pointer bg-gradient-to-bl from-stone-200 to-stone-50  hover:bg-slate-300">
				<h2>{brand.name}</h2>
				<Image src={brand.image} alt={brand.name} width={100} height={100} />
			</div>
		</Link>
	);
};

export default BrandCard;
