import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

const BrandDetails = () => {
	const router = useRouter();
	const raceId = router.query.raceId;
	return <Layout>Here is my Brand ID: {raceId}</Layout>;
};

export default BrandDetails;
