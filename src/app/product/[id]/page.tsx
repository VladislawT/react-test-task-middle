import ProductInteraction from "@/components/ProductInteraction";
import { getProduct } from "@/services/api";
import { ProductsIterface } from "@/types";
import { getProductColorById } from "@/utils/getProductColor";
import Image from "next/image";
import React, { JSX } from "react";

const ProductPage = async ({
    params,
    searchParams,
}: {
    searchParams: Promise<{ colorId: string; size: string }>;
    params: Promise<{ id: string }>;
}): Promise<JSX.Element> => {
    const { id } = await params;
    const product = (await getProduct(Number(id))) as ProductsIterface;
    const { size, colorId } = await searchParams;

    const selectedSize = +size || product.colors[0].sizes[0];
    const selectedColorId = +colorId || product.colors[0].id;
    const displayColor = getProductColorById(product, selectedColorId);

    return (
        <div className="flex-1 flex flex-col gap-4 lg:flex-row md:gap-12 mt-12 mb-12">
            <div className="w-full lg:5/12">
                <div className="relative aspect-2/3">
                    <Image
                        src={displayColor.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                    />
                </div>
            </div>
            <div className="w-full lg:7/12 flex flex-col gap-4 ">
                <h1 className="text-2xl font-medium">{product.name}</h1>
                <p className="text-2xl font-medium">{product.brand}</p>
                <p className="text-gray-500">{displayColor.description}</p>
                <ProductInteraction
                    product={product}
                    selectedSize={selectedSize}
                    selectedColorId={selectedColorId}
                />
            </div>
        </div>
    );
};

export default ProductPage;
