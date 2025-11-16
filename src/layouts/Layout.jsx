import Cart from "@/components/Cart";
import { useAuth } from "@/context/AuthContext";
import {
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  ShoppingCart,
  UserIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const [isPanierOpen, setIsPanierOpen] = useState(false);
  const { user, logout, loading, isAdmin } = useAuth();
  return (
    <>
      <header className="relative">
        <div className="fixed top-0 w-full z-[100] items-center justify-between flex bg-gray-800 bg-opacity-90 px-12 py-4 mx-auto ">
          <div className="text-2xl text-white font-semibold inline-flex items-center">
            {/* <Logo /> */}
            <Link to="/">
              <HomeIcon />
            </Link>
          </div>
          {isAdmin && (
            <div className="absolute text-white right-1/2 translate-x-1/2">
              Espace Admin
            </div>
          )}
          <div>
            <ul className="flex items-center text-white">
              <div
                onClick={() => {
                  setIsPanierOpen(!isPanierOpen);
                }}
                className="flex w-8 h-8 items-center p-1 bg-neutral-100/50 rounded-sm border border-neutral-200 cursor-pointer hover:bg-neutral-100/20 transition-all duration-150"
              >
                <ShoppingCart className=" text-white" />
              </div>
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
        <Cart isPanierOpen={isPanierOpen} setIsPanierOpen={setIsPanierOpen} />
      </header>
      <main className="relative pt-0">
        <Outlet />
      </main>
    </>
  );
}
