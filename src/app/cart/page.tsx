"use client";
import { getSizes } from "@/services/api";
import { SizeInterface } from "@/types";
import React, { JSX, useEffect, useState } from "react";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { getProductColorById } from "@/utils/getProductColor";
import useCartStore from "../stores/cartStore";
import Link from "next/link";
import Image from "next/image";

function CartPage(): JSX.Element {
    const { cart, removeFromCart, incrementQuantity, decrementQuantity } = useCartStore();
    const [sizeCatalog, setSizeCatalog] = useState<SizeInterface[]>([]);
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [errorMessage, setErrorMessage] = useState(0);

    useEffect(() => {
        getSizes().then((data) => {
            setSizeCatalog(data as SizeInterface[]);
        });
    }, []);

    const sizeNameById = (sizeId: number) => {
        const entry = sizeCatalog.find((s) => s.id === sizeId);
        return entry ? entry.name : String(sizeId);
    };

    const applyPromoCode = () => {
        if (promoCode === "0000") {
            setDiscount(10);
            setErrorMessage(0);
        } else {
            setDiscount(0);
            setErrorMessage(1);
        }
    };

    const calculateSubtotal = () => {
        return cart.reduce((acc, item) => {
            const color = getProductColorById(item, item.selectedColorId);
            return acc + Number(color.price) * item.quantity;
        }, 0);
    };

    const calculateDiscountAmount = () => {
        const subtotal = calculateSubtotal();
        return (subtotal * discount) / 100;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscountAmount();
    };

    return (
        <div className="flex w-full flex-col gap-8 items-center justify-center m-auto">
            <h1 className="text-2xl font-medium">Ваша корзина покупок</h1>

            {cart.length > 0 ? (
                <div className="w-full mb-12 flex flex-col lg:flex-row gap-16">
                    <div className="w-full lg:w-7/12 shadow-md border border-gray-100 p-8 rounded-lg flex flex-col gap-8">
                        {cart.map((item) => {
                            const currentColor = getProductColorById(item, item.selectedColorId);
                            return (
                                <div
                                    className="flex items-center justify-between "
                                    key={`${item.id}-${item.selectedColorId}-${item.selectedSize}`}>
                                    <div className="flex gap-8">
                                        <div className="relative w-24 h-32 shrink-0">
                                            <Image
                                                src={currentColor.images[0]}
                                                alt={currentColor.name}
                                                fill
                                                sizes="(max-width: 560px) 100vw, (max-width: 560px) 50vw, 33vw"
                                                className="object-cover rounded-md"
                                                priority
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-medium">{item.name}</p>
                                                <p className="font-medium text-gray-500 ">
                                                    Количество:{" "}
                                                    <button
                                                        onClick={() => decrementQuantity(item)}
                                                        className="cursor-pointer border border-gray-300 p-1 ">
                                                        <FaMinus className="w-4 h-4" />
                                                    </button>
                                                    <span className="inline-block pr-2 pl-2">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => incrementQuantity(item)}
                                                        className="cursor-pointer border border-gray-300 p-1 ">
                                                        <FaPlus className="w-4 h-4" />
                                                    </button>
                                                </p>
                                                <p className="font-medium text-gray-500">
                                                    Размеры: {sizeNameById(item.selectedSize)}
                                                </p>
                                                <p className="font-medium text-gray-500">
                                                    Цвета: {currentColor.name}
                                                </p>
                                                <p className="font-medium text-gray-500">
                                                    {(
                                                        Number(currentColor.price) * item.quantity
                                                    ).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item)}
                                        className="w-8 h-8 rounded-full hover:bg-red-200 bg-red-100 text-red-400 flex items-center justify-center cursor-pointer ">
                                        <FaTrash className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full h-full flex flex-col gap-4 lg:w-5/12">
                        <div className="w-full h-full  shadow-md border border-gray-100 p-8 rounded-lg flex flex-col gap-8 ">
                            <h2 className="font-semibold">Ваш заказ</h2>

                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-500">Товары</p>
                                    <p className="text-sm font-medium">
                                        {calculateSubtotal().toFixed(2)}
                                    </p>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-green-600">
                                            Скидка ({discount}%)
                                        </p>
                                        <p className="text-sm font-medium text-green-600">
                                            {calculateDiscountAmount().toFixed(2)}
                                        </p>
                                    </div>
                                )}

                                <hr className="border-gray-200" />

                                <div className="flex justify-between">
                                    <p className="text-gray-800 font-semibold">Итого</p>
                                    <p className="text-lg font-bold">
                                        {calculateTotal().toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <button className="w-full bg-gray-800 hover:bg-gray-800 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer">
                                Оформить заказ
                            </button>
                        </div>
                        <div className="w-full h-full shadow-md border border-gray-100 p-8 rounded-lg flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2 lg:flex-col xl:flex-row">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                applyPromoCode();
                                            }
                                        }}
                                        placeholder="Введите промокод"
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300">
                                        Применить
                                    </button>
                                </div>
                                <p className="text-sm text-red-400">
                                    {errorMessage ? "Неверный промокод" : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col content-center mb-12 gap-4">
                    <div className="mx-auto">Ваша карзина пуста</div>
                    <Link
                        href="/"
                        className="flex content-center items-center gap-2 bg-amber-400 text-gray-600 hover:bg-amber-500 font-medium px-6 py-2 rounded-lg transition-colors duration-200">
                        <FaShoppingCart className="w-4 h-4 text-gray-600 cursor-pointer" />
                        <p>Начать покупки</p>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default CartPage;
