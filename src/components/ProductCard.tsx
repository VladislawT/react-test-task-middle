"use client";
import { ProductsIterface, SizeInterface } from "@/types";
import React, { JSX, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "@/app/stores/cartStore";
import { getSizes } from "@/services/api";
import { toast } from "react-toastify";

function ProductCard({ product }: { product: ProductsIterface }): JSX.Element {
    const [sizeCatalog, setSizeCatalog] = useState<SizeInterface[]>([]);
    const [productTypes, setProductTypes] = useState({
        size: product.colors[0].sizes[0],
        colorId: product.colors[0].id,
    });
    const { addToCart } = useCartStore();

    useEffect(() => {
        getSizes().then((data) => {
            setSizeCatalog(data as SizeInterface[]);
        });
    }, []);

    const currentColor =
        product.colors.find((c) => c.id === productTypes.colorId) ?? product.colors[0];

    const handeleProductType = ({
        type,
        value,
    }: {
        type: "size" | "colorId";
        value: number | string;
    }) => {
        setProductTypes((prev) => {
            if (type === "size") {
                return { ...prev, size: Number(value) };
            }
            const nextColorId = value as number;
            const nextColor = product.colors.find((c) => c.id === nextColorId) ?? product.colors[0];
            const nextSize = nextColor.sizes.includes(prev.size)
                ? prev.size
                : (nextColor.sizes[0] ?? prev.size);
            return {
                ...prev,
                colorId: nextColorId,
                size: nextSize,
            };
        });
    };

    const hasAvailableSizes = currentColor.sizes.length > 0;

    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity: 1,
            selectedSize: productTypes.size,
            selectedColorId: productTypes.colorId,
        });
        toast.success("Товар добавлен в корзину");
    };

    return (
        <div className="shadow-lg rounded-lg overflow-hidden text-center ">
            <Link
                href={`/product/${product.id}?size=${productTypes.size}&colorId=${productTypes.colorId}`}>
                <div className="relative aspect-2/3">
                    <Image
                        src={currentColor.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover hover:scale-105 transition-all duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                        loading="eager"
                    />
                </div>
            </Link>
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-medium">{product.name}</h1>
                <div className="text-base text-gray-500">{product.brand}</div>
                <div className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">Размеры:</span>
                        <select
                            name="size"
                            id="size"
                            disabled={!hasAvailableSizes}
                            className="ring ring-gray-300 rounded-md px-2 py-1 enabled:cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:ring-gray-200"
                            value={
                                hasAvailableSizes && currentColor.sizes.includes(productTypes.size)
                                    ? productTypes.size
                                    : ""
                            }
                            onChange={(e) =>
                                handeleProductType({
                                    type: "size",
                                    value: e.target.value,
                                })
                            }>
                            {!hasAvailableSizes ? (
                                <option value="" disabled>
                                    Нет в наличии
                                </option>
                            ) : (
                                currentColor.sizes.map((sizeId) => {
                                    const entry = sizeCatalog.find((s) => s.id === sizeId);
                                    return (
                                        <option key={sizeId} value={sizeId}>
                                            {entry ? `${entry.name} - ${entry.number}` : "—"}
                                        </option>
                                    );
                                })
                            )}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium">Цвета:</span>
                        <div className="flex items-center gap-2">
                            {product.colors.map((color) => (
                                <div
                                    className={`cursor-pointer border ${productTypes.colorId === color.id ? "border-gray-500" : "border-gray-200"} rounded-full p-1`}
                                    key={color.name}
                                    onClick={() =>
                                        handeleProductType({
                                            type: "colorId",
                                            value: color.id,
                                        })
                                    }>
                                    <div
                                        className="w-3.5 h-3.5 rounded-full"
                                        style={{
                                            backgroundColor: color.hex,
                                        }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <p className="font-medium">{currentColor.price}</p>
                    <button
                        onClick={() => handleAddToCart()}
                        disabled={!hasAvailableSizes}
                        className={`ring-1 shadow-lg rounded-md px-2 py-1 text-sm cursor-pointer ${!hasAvailableSizes ? "text-gray-200 ring-gray-200" : "text-gray-600 ring-gray-500 hover:text-white hover:bg-black"} transition-all duration-300 flex items-center gap-2`}>
                        <FaShoppingCart
                            className={`w-4 h-4 ${!hasAvailableSizes ? "text-gray-200" : "text-gray-600"} cursor-pointer`}
                        />
                        В корзину
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
