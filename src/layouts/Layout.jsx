import { useAuth } from "@/context/AuthContext";
import { HomeIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const { user, logout, loading } = useAuth();
  useEffect(() => {
    console.log("USer", user);
  }, [user]);
  return (
    <>
      <header className="relative">
        <div className="fixed top-0 w-full z-50 items-center justify-between flex bg-gray-800 bg-opacity-90 px-12 py-4 mx-auto ">
          <div className="text-2xl text-white font-semibold inline-flex items-center">
            {/* <Logo /> */}
            <Link to="/">
              <HomeIcon />
            </Link>
          </div>
          <div>
            <ul className="flex text-white">
              {loading == false && user ? (
                <>
                  <li className="ml-5 px-2 py-1 flex items-center">
                    <Link to={"/profile"}>
                      <div className="flex gap-2">
                        <UserIcon className="mr-2" /> {user.nom || "User"}
                      </div>
                    </Link>
                  </li>
                  <li
                    className="ml-5 px-2 py-1 cursor-pointer"
                    onClick={logout}
                  >
                    <LogOutIcon className="inline mr-1" /> Logout
                  </li>
                </>
              ) : (
                <>
                  <li className="ml-5 px-2 py-1">
                    <Link className="flex" to="/login">
                      <LogInIcon className="mx-1" /> Login
                    </Link>
                  </li>
                  <li className="ml-5 px-2 py-1">
                    <Link className="flex underline" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
