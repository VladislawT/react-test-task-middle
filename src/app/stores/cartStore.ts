import { CartStoreActionsType, CartStoreStateType } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
    devtools(
        persist(
            (set) => ({
                cart: [],
                hasHydrated: false,
                addToCart: (product) =>
                    set(
                        (state) => {
                            const existingIndex = state.cart.findIndex(
                                (p) =>
                                    p.id === product.id &&
                                    p.selectedSize === product.selectedSize &&
                                    p.selectedColorId === product.selectedColorId,
                            );
                            if (existingIndex !== -1) {
                                const updatedCart = [...state.cart];
                                updatedCart[existingIndex].quantity += product.quantity || 1;
                                return { cart: updatedCart };
                            }
                            return {
                                cart: [
                                    ...state.cart,
                                    {
                                        ...product,
                                        quantity: product.quantity || 1,
                                        selectedSize: product.selectedSize,
                                        selectedColorId: product.selectedColorId,
                                    },
                                ],
                            };
                        },
                        false,
                        "addToCart",
                    ),
                removeFromCart: (product) =>
                    set(
                        (state) => ({
                            cart: state.cart.filter(
                                (p) =>
                                    !(
                                        p.id === product.id &&
                                        p.selectedSize === product.selectedSize &&
                                        p.selectedColorId === product.selectedColorId
                                    ),
                            ),
                        }),
                        false,
                        "removeFromCart",
                    ),
                incrementQuantity: (item) =>
                    set(
                        (state) => ({
                            cart: state.cart.map((p) =>
                                p.id === item.id &&
                                p.selectedSize === item.selectedSize &&
                                p.selectedColorId === item.selectedColorId
                                    ? {
                                          ...p,
                                          quantity: p.quantity + 1,
                                      }
                                    : p,
                            ),
                        }),
                        false,
                        "incrementQuantity",
                    ),
                decrementQuantity: (item) =>
                    set(
                        (state) => ({
                            cart: state.cart.map((p) =>
                                p.id === item.id &&
                                p.selectedSize === item.selectedSize &&
                                p.selectedColorId === item.selectedColorId
                                    ? {
                                          ...p,
                                          quantity: Math.max(p.quantity - 1, 1),
                                      }
                                    : p,
                            ),
                        }),
                        false,
                        "decrementQuantity",
                    ),
                clearCart: () => set({ cart: [] }, false, "clearCart"),
            }),
            {
                name: "cart",
                storage: createJSONStorage(() => localStorage),
                onRehydrateStorage: () => (state) => {
                    if (state) {
                        state.hasHydrated = true;
                    }
                },
            },
        ),
        {
            name: "CartStore",
            enabled: process.env.NODE_ENV !== "production",
        },
    ),
);

export default useCartStore;
