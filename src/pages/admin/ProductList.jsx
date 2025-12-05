import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const ProductTable = () => {
  const token = localStorage.getItem("jwt");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  // 2. Action Handlers (these would typically open a modal or navigate to a new page)
  const handleEdit = (productId) => {
    // Logic to open an edit form or navigate
    navigate("/admin/produits/edit/" + productId);
  };

  const handleDelete = async (id) => {
    // Optional: Add a loading state here if you want
    try {
      await api.delete(`/admin/produits/${id}`, {
        headers: { Authorization: "Bearer " + token },
      });

      // Update the local state to remove the item from the table immediately
      setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));

      // Optional: Add a toast notification
      toast.success("Produit supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      // toast.error("Impossible de supprimer ce produit");
    }
  };
  const fetchProducts = async () => {
    await api
      .get("/admin/produits", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        console.log("produiuts", res.data.data);
        const productsData = res.data.data;
        if (productsData) {
          setProducts(productsData.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-0  min-h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Product List Admin
        </h2>
        <div>
          <Button
            onClick={() => {
              navigate("/admin/produits/add");
            }}
          >
            Ajouter un produit
          </Button>
        </div>
      </div>

      {/* Table Container with scroll for small screens */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Head */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Stock
              </th>
              {/* Action Column Header */}
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                {/* Product Data Columns */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {product?.type_produit?.nom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  ${product.prix}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock > 50
                        ? "bg-green-100 text-green-800"
                        : product.stock > 10
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>

                {/* Action Column */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-indigo-600 hover:text-indigo-900 mx-1 transition duration-150 ease-in-out font-medium"
                    aria-label={`Edit ${product.name}`}
                  >
                    Edit
                  </button>

                  {/* Separator */}
                  <span className="text-gray-300">|</span>

                  {/* POPOVER DELETE CONFIRMATION */}
                  <Popover>
                    <PopoverTrigger asChild>
                      {/* We use asChild so the Popover uses your existing button styles */}
                      <button
                        className="text-red-600 hover:text-red-900 mx-1 transition duration-150 ease-in-out font-medium outline-none"
                        aria-label={`Delete ${product.nom}`}
                      >
                        Delete
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-64 p-4 bg-white shadow-xl border border-gray-100 rounded-lg">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">
                          Confirmer la suppression ?
                        </h4>
                        <p className="text-sm text-gray-500">
                          Cette action est irréversible. Le produit sera retiré
                          de la base de données.
                        </p>
                        <div className="flex justify-end space-x-2">
                          {/* The backend delete is triggered only here */}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-white"
                            onClick={() => handleDelete(product.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fallback for empty list */}
        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-white">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTable;
