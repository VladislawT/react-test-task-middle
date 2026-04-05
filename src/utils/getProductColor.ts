import { ColorsIterface, ProductsIterface } from "@/types";

export function getProductColorById(product: ProductsIterface, colorId: number): ColorsIterface {
    return product.colors.find((item) => item.id === colorId) ?? product.colors[0];
}
