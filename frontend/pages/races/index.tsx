import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { makeUrl, useAuth } from '../../auth';
import type { GetServerSideProps, NextPage } from 'next';
import BrandCard from '../../components/BrandCard';

const Brands = () => {
	const [loadingApiResponse, setLoadingApiResponse] = useState(true);
	const [brands, setBrands] = useState<Brand[]>([]);
	const url = makeUrl('/api/races/');
	const { loading, accessToken } = useAuth();

	useEffect(() => {
		const getBrands = async () => {
			if (accessToken) {
				const resp = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					}
				});
				const data = await resp.json();
				setBrands(data.results);
				setLoadingApiResponse(false);
			}
		};
		getBrands();
	}, [accessToken]);
	return (
		<Layout>
			<h1>Races</h1>
			{!loadingApiResponse ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{brands?.map((data) => {
						return <BrandCard key={data.id} brand={data} />;
					})}
				</div>
			) : (
				<div>Loading...</div>
			)}
		</Layout>
	);
};

export default Brands;
