import { useAuth } from "@/context/AuthContext";
import {
  HomeIcon,
  Layout,
  LogInIcon,
  LogOutIcon,
  ShoppingCart,
  UserIcon,
  ShoppingBag,
  ChevronDown,
  User
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout, loading, isAdmin } = useAuth();
  
  // État pour gérer l'ouverture du menu déroulant
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le menu si on clique ailleurs sur la page
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Fonction pour fermer le menu lors du clic sur un lien
  const closeDropdown = () => setIsDropdownOpen(false);

  return (
    <div>
      <header className="relative">
        <div className="fixed top-0 w-full z-[100] items-center justify-between flex bg-gray-800 bg-opacity-90 px-12 py-4 mx-auto shadow-md backdrop-blur-sm">
          
          {/* Logo / Home */}
          <div className="text-2xl text-white font-semibold inline-flex items-center gap-2">
            <Link to="/">
              <HomeIcon />
            </Link>
          </div>

          {/* Admin Link */}
          {isAdmin && (
            <div className="absolute text-white right-1/2 translate-x-1/2 hidden md:block">
              <Link
                to="/admin"
                className="flex items-center gap-2 rounded-md px-3 py-2 bg-indigo-600 hover:bg-indigo-500 duration-200 text-zinc-100 shadow-sm"
              >
                <span>Admin dashboard</span>
                <Layout size={18} />
              </Link>
            </div>
          )}

          {/* Right Side Menu */}
          <div>
            <ul className="flex items-center text-white gap-4">
              
              {/* Panier */}
              <li
                onClick={() => navigate("/panier")}
                className="flex w-10 h-10 items-center justify-center rounded-full cursor-pointer hover:bg-white/10 transition-all duration-150 relative"
              >
                <ShoppingCart className="text-white w-5 h-5" />
              </li>

              {loading === false && user ? (
                <>
                  {/* USER DROPDOWN */}
                  <li className="relative ml-2" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
                    >
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
                         {user.nom ? user.nom.charAt(0).toUpperCase() : "U"}
                      </div>
                      <span className="hidden sm:block font-medium">{user.nom || "User"}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Le Menu Déroulant */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right text-gray-800">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">Bonjour, {user.nom}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        
                        <div className="py-1">
                          <Link 
                            to="/profile" 
                            onClick={closeDropdown}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <User size={16} className="mr-3" />
                            Mon Profil
                          </Link>
                          
                          <Link 
                            to="/mes-commandes" 
                            onClick={closeDropdown}
                            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <ShoppingBag size={16} className="mr-3" />
                            Mes Commandes
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 py-1">
                          <button
                            onClick={() => {
                              closeDropdown();
                              logout();
                            }}
                            className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOutIcon size={16} className="mr-3" />
                            Déconnexion
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                </>
              ) : (
                /* Auth Links (Login/Register) */
                <div className="flex items-center gap-4 ml-4">
                  <li>
                    <Link className="flex items-center hover:text-indigo-400 transition-colors" to="/login">
                      <LogInIcon className="mx-1 w-4 h-4" /> Login
                    </Link>
                  </li>
                  <li>
                    <Link className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white text-sm font-medium transition-colors" to="/register">
                      Register
                    </Link>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
}