export interface ProductsIterface {
    id: number;
    name: string;
    categoryId: number;
    brand: string;
    colors: ColorsIterface[];
}
export interface ColorsIterface {
    id: number;
    name: string;
    images: string[];
    price: string;
    description: string;
    sizes: number[];
    hex: string;
}

export interface SizeInterface {
    id: number;
    name: string;
    number: number;
}

export interface CategoriesInterface {
    id: number;
    name: string;
}

export interface CartItemType extends ProductsIterface {
    quantity: number;
    selectedSize: number;
    selectedColorId: number;
}

export interface CartStoreStateType {
    cart: CartItemType[];
    hasHydrated: boolean;
}

export interface ChangeQuantityType {
    id: number;
    selectedSize: number;
    selectedColorId: number;
}

export interface CartStoreActionsType {
    addToCart: (product: CartItemType) => void;
    removeFromCart: (product: CartItemType) => void;
    incrementQuantity: (item: ChangeQuantityType) => void;
    decrementQuantity: (item: ChangeQuantityType) => void;
    clearCart: () => void;
}
