import Nav from "./Nav";

const Layout = ({children}): React.ReactElement => {
  return (
    <div>
      <Nav />
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout;