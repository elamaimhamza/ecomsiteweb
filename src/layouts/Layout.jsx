import Cart from "@/components/cart";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
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
      <Nav />
      <main className="relative pt-0">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
