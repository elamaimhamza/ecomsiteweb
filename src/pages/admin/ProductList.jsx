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
import { SquarePen, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductTable = () => {
  let token = localStorage.getItem("jwt");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    links: [], // We will use this array
    from: 0,
    to: 0,
  });

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
    }
  };
  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    await api
      .get(`/admin/produits?page=${page}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const productsData = res.data.data;
        if (productsData) {
          setProducts(productsData.products);
          setPagination(productsData.meta);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  // 1. Reusable Pagination Component to avoid code duplication
  const PaginationControl = ({
    pagination,
    onPageChange,
    isLoading,
    className,
  }) => {
    // Safety check
    if (!pagination || !pagination.last_page || pagination.last_page <= 1)
      return null;

    const { current_page, last_page, from, to, total } = pagination;

    // Helper to generate page numbers with ellipses
    const getPageNumbers = () => {
      const pages = [];
      const delta = 1; // How many numbers to show on each side of current page

      // Always show page 1
      pages.push(1);

      // Add ellipsis if gap exists between 1 and the start of the window
      if (current_page - delta > 2) {
        pages.push("...");
      }

      // Add pages around current page
      for (
        let i = Math.max(2, current_page - delta);
        i <= Math.min(last_page - 1, current_page + delta);
        i++
      ) {
        pages.push(i);
      }

      // Add ellipsis if gap exists between window and last page
      if (current_page + delta < last_page - 1) {
        pages.push("...");
      }

      // Always show last page if it's not page 1
      if (last_page > 1) {
        pages.push(last_page);
      }

      return pages;
    };

    const handlePageClick = (page) => {
      if (page !== "..." && page !== current_page && !isLoading) {
        onPageChange(page);
      }
    };

    return (
      <div
        className={cn(
          "bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 " +
            className
        )}
      >
        {/* Mobile View: Simple Prev/Next */}
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1 || isLoading}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white 
            ${
              current_page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Précédent
          </button>
          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === last_page || isLoading}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white 
            ${
              current_page === last_page
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-50 cursor-pointer"
            }`}
          >
            Suivant
          </button>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{from || 0}</span> à{" "}
              <span className="font-medium">{to || 0}</span> sur{" "}
              <span className="font-medium">{total || 0}</span> résultats
            </p>
          </div>

          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              {/* Previous Button */}
              <button
                onClick={() => onPageChange(current_page - 1)}
                disabled={current_page === 1 || isLoading}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                ${
                  current_page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <span className="sr-only">Précédent</span>
                {/* Chevron Left Icon */}
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Page Numbers */}
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(page)}
                  disabled={page === "..."}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                  ${
                    page === current_page
                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 cursor-default"
                      : page === "..."
                      ? "bg-white border-gray-300 text-gray-700 cursor-default"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 cursor-pointer"
                  }
                `}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => onPageChange(current_page + 1)}
                disabled={current_page === last_page || isLoading}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                ${
                  current_page === last_page
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <span className="sr-only">Suivant</span>
                {/* Chevron Right Icon */}
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-0  min-h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          La liste des produits :
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

      {/* --- TOP PAGINATION --- */}
      <div className="border-b  border-gray-200">
        <PaginationControl
          pagination={pagination}
          onPageChange={fetchProducts}
          isLoading={isLoading}
          className={"rounded-t-lg"}
        />
      </div>

      {/* --- TABLE CONTAINER (Relative for loading overlay) --- */}
      <div className="relative overflow-x-auto min-h-[400px]">
        {/* LOADING SPINNER OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 min-h-[400px] bg-white/80 z-20 flex items-center justify-center backdrop-blur-[1px]">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-500">
                Chargement...
              </span>
            </div>
          </div>
        )}

        <table
          className={`min-w-full divide-y divide-gray-200 ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          {/* Table Head */}
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Stock
              </th>
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
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex items-center justify-center">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(product.id)}
                    className="text-indigo-600 hover:text-indigo-900 mx-1 transition duration-150 ease-in-out font-medium cursor-pointer"
                    aria-label={`Edit ${product.name}`}
                  >
                    <SquarePen size={18} />
                  </button>

                  <span className="text-gray-300 mx-1">|</span>

                  {/* POPOVER DELETE CONFIRMATION */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="text-red-600 hover:text-red-900 mx-1 transition duration-150 ease-in-out font-medium outline-none cursor-pointer"
                        aria-label={`Delete ${product.nom}`}
                      >
                        <Trash2 size={18} />
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

        {/* Fallback for empty list (Only show if not loading) */}
        {!isLoading && products.length === 0 && (
          <div className="p-10 text-center text-gray-500 bg-white">
            <p>Aucun produit trouvé.</p>
          </div>
        )}
      </div>

      {/* --- BOTTOM PAGINATION --- */}
      <div className="border-t border-gray-200">
        <PaginationControl
          pagination={pagination}
          onPageChange={fetchProducts}
          isLoading={isLoading}
          className={"rounded-b-lg"}
        />
      </div>
    </div>
  );
};

export default ProductTable;
