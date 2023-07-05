import Layout from '../components/Layout';
import { useAuth } from '../auth';

const Me: React.SFC = (): React.ReactElement => {
	const { loading, user } = useAuth();

	return (
		<Layout>
			{loading || !user ? (
				<p>Loading...</p>
			) : (
				<>
					<h1 className="text-xl pt-3 pb-5">Welcome {user.email}!</h1>
					<span>Profile details:</span>
					<ul className="mt-4">
						<li>ID: {user.id}</li>
						<li>First Name: {user.first_name}</li>
						<li>Last Name: {user.first_name}</li>
						<li>Email: {user.email}</li>
					</ul>
				</>
			)}
		</Layout>
	);
};

export default Me;
