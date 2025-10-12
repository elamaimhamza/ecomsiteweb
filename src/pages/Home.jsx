import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Men",
    image: "/Logo_homme.jpg",
    query: "male",
  },
  {
    name: "Women",
    image: "/Logo_femme.webp",
    query: "female",
  },
  {
    name: "Kids",
    image: "/Logo_enfant.avif",
    query: "kids",
  },
];

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("jwt");

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/user/verify", {
          api_token: token,
        });

        // If verification fails on the server side, redirect
        if (!res.data.valid) {
          localStorage.removeItem("jwt"); // Optional: clear invalid token
          navigate("/login");
        } else {
          console.log("User verified:", res.data);
        }
      } catch (err) {
        console.error("Verification error:", err);
        localStorage.removeItem("jwt"); // Optional: clear token on error
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        Bienvenue dans notre Boutique
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {categories.map((cat) => (
          <Link
            to={`/products?category=${cat.query}`}
            key={cat.name}
            className="group relative block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-transparent bg-opacity-40 flex flex-col justify-end p-4">
              <h2 className="text-white text-2xl font-semibold">{cat.name}</h2>
              <Button variant="secondary" className="mt-2 w-fit">
                Shop {cat.name}
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
