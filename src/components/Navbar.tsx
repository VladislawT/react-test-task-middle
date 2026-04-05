import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { Suspense, JSX } from "react";
import SearchBar from "./SearchBar";
import ShoppingCartIcon from "./ShoppingCartIcon";

function Navbar(): JSX.Element {
    return (
        <div className="w-full flex items-center justify-between border-b border-gray-500 pb-4 pt-4">
            <div className="flex items-center w-full justify-between">
                <Link href="/" className="flex items-center">
                    <IoMdHome className="w-8 h-8 text-gray-600 " />
                </Link>
                <div className="flex items-center gap-6 pr-3">
                    <Suspense
                        fallback={
                            <div
                                className="hidden sm:block w-full min-w-48 max-w-xs h-10 rounded-md ring-1 ring-gray-200"
                                aria-hidden
                            />
                        }>
                        <SearchBar />
                    </Suspense>
                    <ShoppingCartIcon />
                </div>
            </div>
        </div>
    );
}

export default Navbar;
