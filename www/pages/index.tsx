import Link from 'next/link'
import Layout from "../components/Layout";

const HomePage = (): React.ReactElement => {
  return (
    <Layout>
      <h1 className="text-xl pt-3 pb-5">Welcome to the app</h1>
      <ul className="list-disc">
        <li>Signup</li>
        <li><Link href="/login"><a>Login</a></Link></li>
        <li>Profile</li>
      </ul>
    </Layout>
  )
}

export default HomePage;