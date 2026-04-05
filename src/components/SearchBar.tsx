"use client";

import React, { JSX, useCallback, useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useRouter, useSearchParams } from "next/navigation";
import { MdClear } from "react-icons/md";

function SearchBar(): JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchFromUrl = searchParams.get("search") ?? "";
    const [value, setValue] = useState(searchFromUrl);

    useEffect(() => {
        setValue(searchFromUrl);
    }, [searchFromUrl]);

    const handleSearch = useCallback(
        (nextValue: string) => {
            const params = new URLSearchParams(searchParams.toString());
            const trimmed = nextValue.trim();
            if (trimmed) params.set("search", trimmed);
            else params.delete("search");
            router.replace(`/?${params.toString()}`, {
                scroll: false,
            });
        },
        [router, searchParams],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(value);
        }
    };

    return (
        <div className="">
            <div className="relative hidden sm:flex items-center gap-2 rounded-md ring-1 ring-gray-200 px-2 py-1">
                <input
                    name="search"
                    type="text"
                    className="w-full pl-4 pr-4 py-2 focus:outline-none"
                    placeholder="Поиск..."
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
                <div className="min-w-6">
                    {value.length > 0 && (
                        <MdClear
                            onClick={() => setValue("")}
                            className="w-6 h-6 text-gray-500 cursor-pointer"
                        />
                    )}
                </div>
                <div className="min-w-6">
                    <CiSearch
                        onClick={() => handleSearch(value)}
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
