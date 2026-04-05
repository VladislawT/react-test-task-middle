"use client";
import { getCategories } from "@/services/api";
import { CategoriesInterface } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

function Categories(): JSX.Element {
    const [categories, setCategories] = useState<CategoriesInterface[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const categoryParams = useSearchParams();
    const categoryParam = categoryParams.get("category");
    const selectedCategory = categoryParam ? Number(categoryParam) : null;

    useEffect(() => {
        getCategories()
            .then((data) => {
                setCategories(data as CategoriesInterface[]);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (id: number | null) => {
        const params = new URLSearchParams(categoryParams.toString());
        if (id !== null) {
            if (params.get("category") === id.toString()) {
                params.delete("category");
            } else {
                params.set("category", id.toString());
            }
        }
        router.push(`/?${params.toString()}`, { scroll: false });
    };

    return (
        <div>
            {loading ? (
                <ul
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 bg-gray-100 rounded-lg text-sm text-black"
                    aria-busy="true"
                    aria-label="Загрузка категорий">
                    {Array.from({ length: 4 }).map((item, i) => (
                        <li key={i} className="p-2">
                            <div className="h-5 mx-auto max-w-[90%] rounded bg-gray-200 animate-pulse" />
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 bg-gray-100 rounded-lg text-sm text-black">
                    {categories.map((category) => (
                        <li
                            className={`text-center cursor-pointer p-2 hover:bg-gray-300 ${category.id === selectedCategory ? "bg-amber-400" : "text-gray-500"}`}
                            key={category.id}
                            onClick={() => handleChange(category.id)}>
                            {category.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Categories;
