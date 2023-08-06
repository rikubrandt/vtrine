import { Toaster } from "react-hot-toast";
import Header from "./Header";
import MiniProfile from "./MiniProfile";
import Suggestions from "./Suggestions";
import { useContext } from "react";
import { UserContext } from "../lib/context";

function Layout({ children }) {
  const { user, username, image, name } = useContext(UserContext);

  return (
    <div className="bg-gray-50 h-screen overflow-y-scroll scrollbar-hide">
      <Header />
      <main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto">
        <section className="col-span-2 ">
          {/* CHILDREDN COMPONENTS */}

          {children}
        </section>

        <section className="hidden xl:inline-grid md:col-span-1">
          {/* MINI PROFILE */}
          <div className="fixed top-20">
            {username && (
              <>
                <MiniProfile username={username} name={name} image={image} />
                <Suggestions />
              </>
            )}
            {/* Suggestions */}
          </div>
        </section>
      </main>
      <Toaster />
    </div>
  );
}

export default Layout;
