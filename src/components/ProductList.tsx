import Categories from "./Categories";
import { getProducts } from "@/services/api";
import { ProductsIterface } from "@/types";
import ProductCard from "./ProductCard";
import Link from "next/link";
import Filter from "./Filter";
import { FaFilterCircleXmark } from "react-icons/fa6";

async function ProductList({
    category,
    sort,
    filter,
    search,
}: {
    category?: string;
    sort?: string;
    filter?: string;
    search?: string;
}) {
    const products = (await getProducts()) as ProductsIterface[];
    const normalizedSearch = (search ?? "").trim().toLowerCase();
    const categoryId = category ? Number(category) : null;
    const filteredProducts = products.filter((p) => {
        const matchesCategory = categoryId ? p.categoryId === categoryId : true;
        const matchesSearch = normalizedSearch
            ? p.name.toLowerCase().includes(normalizedSearch)
            : true;
        const matchesInStock =
            filter === "inStock" ? p.colors.some((color) => color.sizes.length > 0) : true;
        return matchesCategory && matchesSearch && matchesInStock;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = Number(a.colors[0].price ?? 0);
        const priceB = Number(b.colors[0].price ?? 0);
        if (sort === "asc") return priceA - priceB;
        if (sort === "desc") return priceB - priceA;
        return 0;
    });
    return (
        <div className="w-full flex-1 flex flex-col">
            <Categories />
            <Filter />
            {sortedProducts.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12 mb-8">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex w-full flex-col gap-8 items-center justify-center m-auto">
                    <div className="flex flex-col content-center mb-12 gap-4 text-center">
                        <h2 className="mx-auto text-xl">По этим фильтрам ничего не нашлось</h2>
                        <p>Попробуйте убрать фильтры</p>
                        <Link
                            href="/"
                            className=" bg-amber-400 text-gray-600 hover:bg-amber-500 font-medium px-6 py-2 rounded-lg transition-colors duration-200">
                            <div className="flex content-center items-center justify-center gap-2">
                                <FaFilterCircleXmark />
                                <p>Сбросить фильтры</p>
                            </div>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductList;
