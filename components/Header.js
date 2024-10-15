import Image from "next/image";
import Link from "next/link";
import {
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    PaperAirplaneIcon,
    Bars3Icon,
    ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../lib/context";
import { signOutUser } from "../lib/firebase";
import { useContext, useState } from "react";
import SearchBar from "./SearchBar";

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { username, image, name, loading } = useContext(UserContext);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    if (loading) {
        return (
            <div className="shadow-sm border-b bg-white md:sticky md:top-0 z-50">
                <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">
                    <div className="relative w-24 h-10 bg-gray-200 animate-pulse rounded"></div>

                    <div className="w-1/3 h-10 bg-gray-200 animate-pulse rounded"></div>

                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="shadow-sm border-b bg-white md:sticky md:top-0 z-50">
            {isOpen && (
                <div
                    className={`absolute right-0 top-16 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-50`}
                >
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="options-menu"
                    >
                        <Link href="/">
                            <div className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">
                                Home
                            </div>
                        </Link>
                        <Link href="/add">
                            <div className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">
                                Add Post
                            </div>
                        </Link>
                        <Link href="/discover">
                            <div className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">
                                Discover
                            </div>
                        </Link>
                        <Link href="/notifications">
                            <div className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">
                                Notifications
                            </div>
                        </Link>
                        <Link href="/[username]" as={`/${username}`}>
                            <div className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer">
                                Profile
                            </div>
                        </Link>
                        <div
                            className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white cursor-pointer"
                            onClick={signOutUser}
                        >
                            Logout
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">
                {/* LOGO */}
                <div className="relative hidden lg:inline-grid w-24 cursor-pointer">
                    <Link href="/">
                        <Image
                            src="/logomini.png?key=123"
                            fill
                            style={{ objectFit: "contain" }}
                            alt="Logo"
                        />
                    </Link>
                </div>
                <div className="relative w-10 lg:hidden flex-shrink-0">
                    <Link href="/">
                        <Image
                            alt="Logo"
                            src="/logomini.png?key=123"
                            fill
                            style={{ objectFit: "contain" }}
                        />
                    </Link>
                </div>

                {/* SEARCH BAR */}
                <SearchBar />

                {/* MENU ITEMS */}
                <div className="flex items-center justify-end md:space-x-4 space-x-1">
                    {/* Conditionally render based on username */}
                    {username ? (
                        <>
                            <Link href="/">
                                <HomeIcon className="navBtn" />
                            </Link>
                            <Bars3Icon
                                className="h-6 md:hidden cursor-pointer"
                                onClick={toggleMenu}
                            />
                            <div className="relative navBtn">
                                <PaperAirplaneIcon className="navBtn" />
                            </div>
                            <Link href="/add">
                                <PlusCircleIcon className="navBtn" />
                            </Link>
                            <Link href="/discover">
                                <UserGroupIcon className="navBtn" />
                            </Link>
                            <Link href="/notifications">
                                <HeartIcon className="navBtn" />
                            </Link>

                            <Link href="/[username]" as={`/${username}`}>
                                <img
                                    src={image ? image : "./placeholder.jpg"}
                                    alt="profile pic"
                                    className="h-10 w-10 md:h-14 md:w-14 rounded-full object-fit cursor-pointer flex-shrink-0"
                                />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                                    Login
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded shadow">
                                    Register
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Header;
