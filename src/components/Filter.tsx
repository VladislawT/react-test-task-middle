"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
    const router = useRouter();
    const categoryParams = useSearchParams();
    const pathname = usePathname();
    const currentSort = categoryParams.get("sort") ?? "";
    const currentFilter = categoryParams.get("filter") ?? "";

    const handleSort = (value: string) => {
        const params = new URLSearchParams(categoryParams);
        if (value) params.set("sort", value);
        else params.delete("sort");
        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };

    const handleFilter = () => {
        const params = new URLSearchParams(categoryParams);

        if (currentFilter === "inStock") {
            params.delete("filter");
        } else {
            params.set("filter", "inStock");
        }

        router.push(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };

    return (
        <div className="flex items-center justify-end gap-2 text-sm text-gray-500 my-6">
            <div className="flex items-center gap-2">
                <span className="text-sm">
                    {currentFilter === "inStock" ? "Только в наличии" : "Все товары"}
                </span>
                <button
                    onClick={() => handleFilter()}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${currentFilter === "inStock" ? "bg-amber-300" : "bg-gray-300"}`}>
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentFilter === "inStock" ? "translate-x-6" : "translate-x-1"}`}
                    />
                </button>
            </div>
            <select
                name="sort"
                id="sort"
                className="ring-1 ring-gray-200 shadow-md p-1 rounded-sm"
                value={currentSort}
                onChange={(e) => handleSort(e.target.value)}>
                <option value="">По умолчанию</option>
                <option value="asc">По возрастанию цены</option>
                <option value="desc">По убыванию цены</option>
            </select>
        </div>
    );
}

export default Filter;
