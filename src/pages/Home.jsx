import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Homme",
    image: "/Logo_homme.avif",
    query: "Homme",
  },
  {
    name: "Femme",
    image: "/Logo_femme.avif",
    query: "Femme",
  },
  {
    name: "Enfant",
    image: "/Logo_enfant.avif",
    query: "Enfant",
  },
];

const Home = () => {
  const { verifyToken, user } = useAuth();

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("jwt");
      if(token){
        console.log("token verification sent")
        await verifyToken(token);
      }
    };
    verify();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center px-4 pt-16 pb-12">
      <h1 className="text-4xl font-bold text-center mb-10 pt-4">
        Bienvenue{" "}
        {user ? (
          <span className="text-indigo-700">{user.nom}</span>
        ) : (
          "dans notre Boutique"
        )}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {categories.map((cat) => (
          <Link
            to={`/products`}
            state={{
              genre: cat.query,
            }}
            key={cat.name}
            className="group relative block rounded-lg overflow-hidden shadow-lg  hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-transparent bg-opacity-40 flex flex-col justify-end p-4">
              <h2 className="text-black text-xl font-semibold">{cat.name}</h2>
              <Button variant="secondary" className="mt-2 w-fit">
                Voir les produits ...
              </Button>
            </div>
          </Link>
        ))}
      </div>
     
    </div>
    
  );
};

export default Home;
