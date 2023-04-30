import Layout from "../components/Layout";
import { useAuth } from "../auth";

const Me: React.SFC = (): React.ReactElement => {
  const { loading, user } = useAuth();
  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1 className="text-xl pt-3 pb-5">Welcome {user.username}!</h1>
        <span>Profile details:</span>
        <ul className="mt-4">
          <li>ID: {user.id}</li>
          <li>Email: {user.email}</li>
          <li>Username: {user.username}</li>
        </ul>
      </Layout>
    );
  }
}

export default Me;