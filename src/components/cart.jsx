import { Minus, Plus, Trash, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Cart({ isPanierOpen, setIsPanierOpen }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState();
  const navigate = useNavigate();
  const getProductsFromCart = () => {
    const panier = localStorage.getItem("panier");
    if (panier && panier.length != 0) {
      let panierData = JSON.parse(panier); // convertir json au js object (array)
      let calculateTotal = 0;
      panierData = panierData.map((produit) => ({
        ...produit,
        total: produit.prix * produit.quantity,
      }));

      panierData.forEach((prod) => {
        calculateTotal += prod.total;
      });

      setTotal(calculateTotal);
      console.log("calculateTotal : ", calculateTotal);
      setProducts(panierData);
    } else {
      setProducts([]);
    }
  };

  const addQuantity = (id) => {
    const panier = localStorage.getItem("panier");
    let panierData = JSON.parse(panier);

    panierData = panierData.map((prod) => {
      if (prod.id == id) {
        return { ...prod, quantity: prod.quantity + 1 };
      } else {
        return { ...prod };
      }
    });
    const newPanier = JSON.stringify(panierData);
    localStorage.setItem("panier", newPanier);
    getProductsFromCart();
    console.log(panierData);
  };

  const substractQuantity = (id) => {
    const panier = localStorage.getItem("panier");
    let panierData = JSON.parse(panier);

    panierData = panierData.map((prod) => {
      if (prod.id == id) {
        return { ...prod, quantity: prod.quantity - 1 };
      } else {
        return { ...prod };
      }
    });
    const newPanier = JSON.stringify(panierData);
    localStorage.setItem("panier", newPanier);
    getProductsFromCart();
    console.log(panierData);
  };

  const deleteProduct = (id) => {
    const panier = localStorage.getItem("panier");
    let panierData = JSON.parse(panier);
    panierData = panierData.filter((prod) => prod.id != id);
    const newPanier = JSON.stringify(panierData);
    localStorage.setItem("panier", newPanier);
    getProductsFromCart();
  };

  useEffect(() => {
    console.log("Cart is mounted");
    getProductsFromCart();
  }, [isPanierOpen]);

  return (
    <div
      className={`fixed z-[110] h-full w-screen backdrop-blur-[2px] bg-neutral-300/30 flex justify-center items-center transition-all duration-500 ${
        isPanierOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={` flex flex-col bg-neutral-100 border-neutral-300 rounded-lg  px-0 min-h-[500px] min-w-[500px] max-h-[calc(100vh-20px)] ${
          isPanierOpen ? "translate-y-0" : "translate-y-full"
        } transition-all duration-500 `}
      >
        <div className="border-neutral-300 bg-gray-800 border-b-2 mb-4 pt-4 rounded-t-md">
          <div className=" flex w-full justify-between px-6 pb-4 text-white">
            <h2 className="font-semibold text-xl">Panier</h2>
            <div
              onClick={() => {
                setIsPanierOpen(!isPanierOpen);
              }}
              className="w-6 h-6 flex items-center border border-transparent hover:border-neutral-200 rounded-sm cursor-pointer duration-150"
            >
              <X />
            </div>
          </div>
        </div>
        <div className=" px-4 overflow-hidden h-full flex-1 ">
          <div className="flex flex-col items-center gap-2   max-h-[400px] overflow-auto modern-scrollbar">
            {/* Product card */}
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.nom + " card"}
                  className="border rounded-sm flex w-full justify-between pl-4 "
                >
                  <div className="flex flex-col justify-between py-2">
                    <div
                      className="text-lg font-semibold cursor-pointer hover:underline"
                      onClick={() => {
                        setIsPanierOpen(!isPanierOpen);
                        console.log(product.id);
                        navigate("/products/" + product.id);
                      }}
                    >
                      {product.nom}
                    </div>
                    <div>prix : {product.prix} €</div>
                  </div>
                  <div className="flex-1 py-2">
                    <div>
                      <div className="centered gap-1">
                        <span className="flex justify-end gap-1 flex-1">
                          <div className="pr-2 flex gap-1">
                            <p>quantity :</p>
                            <span className="border rounded bg-neutral-900 border-neutral-100 w-8 h-8 font-bold flex centered">
                              <p className="text-center  text-white">
                                {product?.quantity}
                              </p>
                            </span>
                          </div>
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <span
                            onClick={() => {
                              addQuantity(product.id);
                            }}
                            className="w-5 h-5 centered bg-neutral-800 text-neutral-50 rounded-xs cursor-pointer"
                          >
                            <Plus size={16} />
                          </span>
                          <span
                            onClick={() => {
                              if (product.quantity > 1) {
                                substractQuantity(product.id);
                              }
                            }}
                            className={`w-5 h-5 centered  text-neutral-50 rounded-xs  ${
                              product.quantity == 1
                                ? "cursor-not-allowed bg-neutral-300"
                                : "cursor-pointer bg-neutral-800"
                            }`}
                          >
                            <Minus size={16} />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="self-end text-end">
                      Total : {product?.total} €
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      deleteProduct(product.id);
                    }}
                    className="centered px-2 ml-1 border-l group hover:bg-red-200 rounded-r-sm transition-all duration-200 cursor-pointer"
                  >
                    <Trash className="text-red-400 group-hover:text-red-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="self-center centered flex-1 h-full">
                Aucun produits dans le panier
              </div>
            )}
          </div>
          {total && (
            <div className="flex justify-end text-end pt-4 pb-6">
              <p className="font-semibold">Total : {total} €</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
