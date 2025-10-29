import { X } from "lucide-react";
import React, { useEffect } from "react";

export default function Cart({ isPanierOpen, setIsPanierOpen }) {
  return (
    <div
      className={`fixed z-[110] h-full w-screen backdrop-blur-[2px] bg-neutral-300/30 flex justify-center items-center transition-all duration-500 ${
        isPanierOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`border bg-neutral-100 border-blue-500 rounded-lg py-4 px-2 min-h-[500px] min-w-[400px] max-h-[600px] ${
          isPanierOpen ? "translate-y-0" : "translate-y-full"
        } transition-all duration-500 `}
      >
        <div className="flex w-full justify-between px-4 pb-4">
          <h2 className="font-semibold text-xl">Panier</h2>
          <div
            onClick={() => {
              setIsPanierOpen(!isPanierOpen);
            }}
            className="flex items-center border border-transparent hover:border-neutral-600 rounded-sm cursor-pointer duration-150"
          >
            <X />
          </div>
        </div>
        <div className="flex flex-col gap-2 overflow-auto max-h-[calc(600px-80px)]">
          {/* Product card */}
          <div className="border rounded-sm flex justify-between px-4 py-2">
            <div>
              <div className="text-lg font-semibold">T-shirt</div>
              <div>prix :19</div>
            </div>
            <div>
              <div>quantity : 1</div>
              <div>Total : 19</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
