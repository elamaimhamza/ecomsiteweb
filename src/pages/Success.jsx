import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: Verify session_id from URL with backend to confirm payment
    // Clear the cart
    localStorage.removeItem("panier");
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Paiement Réussi !
        </h1>
        <p className="text-gray-600 mb-6">Merci pour votre commande.</p>

        <button
          onClick={() => navigate("/")}
          className="bg-neutral-900 text-white px-6 py-2 rounded hover:bg-neutral-800"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
