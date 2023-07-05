import React from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';

const BrandDetails = () => {
	const router = useRouter();
	const brandId = router.query.brandId;
	return <Layout>Here is my Brand ID: {brandId}</Layout>;
};

export default BrandDetails;
