"use client";
import useCartStore from "@/app/stores/cartStore";
import Link from "next/link";
import { JSX } from "react";
import { FaShoppingCart } from "react-icons/fa";

function ShoppingCartIcon(): JSX.Element | null {
    const { cart, hasHydrated } = useCartStore();

    if (!hasHydrated) return null;
    return (
        <div>
            <Link href="/cart" className="relative">
                <FaShoppingCart className="w-8 h-8 text-gray-600 cursor-pointer " />
                <span className="absolute -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
            </Link>
        </div>
    );
}

export default ShoppingCartIcon;
