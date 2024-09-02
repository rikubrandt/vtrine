import "../styles/globals.css";
import { UserContext } from "../lib/context";
import useUserData from "../lib/hooks";
import 'mapbox-gl/dist/mapbox-gl.css';
import { GlobalProvider } from "../lib/globalContext";

function App({ Component, pageProps }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
        <GlobalProvider>

      <Component {...pageProps} />

      </GlobalProvider>

    </UserContext.Provider>
  );
}

export default App;
