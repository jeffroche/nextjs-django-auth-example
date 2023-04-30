import { AuthProvider } from "../auth";
import "../styles.css";
function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />;
    </AuthProvider>
  );
}
export default App;
