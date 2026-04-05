"use client";

import useCartStore from "@/app/stores/cartStore";
import { getSizes } from "@/services/api";
import { ProductsIterface, SizeInterface } from "@/types";
import { getProductColorById } from "@/utils/getProductColor";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { JSX, useEffect, useMemo, useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

function ProductInteraction({
    product,
    selectedSize,
    selectedColorId,
}: {
    product: ProductsIterface;
    selectedSize: number;
    selectedColorId: number;
}): JSX.Element {
    const router = useRouter();
    const pathname = usePathname();
    const serchParams = useSearchParams();
    const [quantity, setQuantity] = useState(1);
    const [sizeCatalog, setSizeCatalog] = useState<SizeInterface[]>([]);

    const { addToCart } = useCartStore();

    useEffect(() => {
        getSizes().then((data) => {
            setSizeCatalog(data as SizeInterface[]);
        });
    }, []);

    const currentColor = getProductColorById(product, selectedColorId);

    const totalPrice = useMemo(() => {
        return (Number(currentColor.price) * quantity).toFixed(2);
    }, [currentColor, quantity]);

    const handleTypeChange = (type: string, value: string) => {
        const params = new URLSearchParams(serchParams.toString());
        if (type === "colorId") {
            const nextColorId = Number(value);
            params.set("colorId", String(nextColorId));

            const nextColor = product.colors.find((c) => c.id === nextColorId) ?? product.colors[0];
            const nextSizes = nextColor.sizes;

            if (!nextSizes.length) {
                params.delete("size");
            } else {
                const hasCurrent = nextSizes.includes(selectedSize);
                const minSize = Math.min(...nextSizes);
                params.set("size", String(hasCurrent ? selectedSize : minSize));
            }
        } else {
            params.set(type, value);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const sizeNameById = (sizeId: number) => {
        const entry = sizeCatalog.find((s) => s.id === sizeId);
        return entry ? entry.name : String(sizeId);
    };
    const hasAvailableSizes = currentColor.sizes.length > 0;

    const handleQuantityChange = (type: "dec" | "inc") => {
        switch (type) {
            case "dec":
                setQuantity((prev) => Math.max(prev - 1, 1));
                break;
            case "inc":
                setQuantity((prev) => prev + 1);
                break;
        }
    };

    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity,
            selectedSize,
            selectedColorId,
        });
        toast.success("Товар добавлен в корзину");
    };

    return (
        <div className="flex flex-col gap-4 mt-4 ">
            <div className="flex flex-col gap-2 text-sm">
                <span className="text-gray-500">Размеры</span>
                <div className="flex items-center gap-2 min-h-7.5">
                    {currentColor.sizes.length ? (
                        currentColor.sizes.map((sizeId) => (
                            <div
                                className={`cursor-pointer border p-0.5 ${selectedSize === sizeId ? "border-gray-800" : "border-gray-200"}`}
                                key={sizeId}
                                onClick={() => handleTypeChange("size", sizeId.toString())}>
                                <div
                                    className={`px-2 py-1 text-center flex items-center justify-center text-xs whitespace-nowrap ${selectedSize === sizeId ? "bg-black text-white" : "bg-white text-black"}`}>
                                    {sizeNameById(sizeId)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-400 text-xl">Размеры отсутствуют</span>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <span className="text-gray-500">Цвета</span>
                <div className="flex items-center gap-2">
                    {product.colors.map((color) => (
                        <div
                            className={`cursor-pointer border ${selectedColorId === color.id ? "border-gray-500" : "border-gray-200"} rounded-full p-1`}
                            key={color.id}
                            onClick={() => handleTypeChange("colorId", color.id.toString())}>
                            <div
                                className="w-3.5 h-3.5 rounded-full"
                                style={{
                                    backgroundColor: color.hex,
                                }}></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <span className="text-gray-500 ">Количество</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleQuantityChange("dec")}
                        className="cursor-pointer border border-gray-300 p-1">
                        <FaMinus className="w-4 h-4" />
                    </button>
                    {quantity}
                    <button
                        onClick={() => handleQuantityChange("inc")}
                        className="cursor-pointer border border-gray-300 p-1">
                        <FaPlus className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">{totalPrice}</div>
            </div>
            <button
                onClick={() => handleAddToCart()}
                disabled={!hasAvailableSizes}
                className={` px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer ${!hasAvailableSizes ? " text-gray-600 bg-gray-200" : "bg-gray-800 text-white hover:text-white hover:bg-black"} `}>
                {" "}
                <FaPlus
                    className={`w-4 h-4 ${!hasAvailableSizes ? "text-gray-600 " : "text-white"} cursor-pointer`}
                />
                Добавить в корзину
            </button>
            <button
                disabled={!hasAvailableSizes}
                className=" px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer ">
                <FaShoppingCart className="w-4 h-4 text-gray-600" />
                Купить этот товар
            </button>
        </div>
    );
}

export default ProductInteraction;
