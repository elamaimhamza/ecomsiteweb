import { HomeIcon, LogInIcon } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="relative">
        <div className="fixed top-0 w-full items-center justify-between flex bg-gray-800 bg-opacity-90 px-12 py-4 mx-auto ">
          <div className="text-2xl text-white font-semibold inline-flex items-center">
            {/* <Logo /> */}
            <Link to="/">
              <HomeIcon />
            </Link>
          </div>
          <div>
            <ul className="flex text-white">
              <li className="ml-5 px-2 py-1">
                <Link className={"flex"} to={"/login"}>
                  <LogInIcon className={"mx-1"} /> Login
                </Link>
              </li>
              <li className="ml-5 px-2 py-1">
                <Link className={"flex underline"} to={"/register"}>
                  Register
                </Link>
              </li>
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
