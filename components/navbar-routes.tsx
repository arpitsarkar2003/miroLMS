"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./Search-Input";


export const NavbarRoutes = () => {
    const pathname = usePathname();
    const router = useRouter();

    const isTeacherPage = pathname?.startsWith("/teacher");
    const isCoursePage = pathname?.includes("/courses");
    const isSearchPage = pathname === "/search";


    return (
        <>
        {isSearchPage && (
            <div className="hidden md:block">
                <SearchInput />
            </div>
        )}
        <div className="flex gap-x-2 ml-auto items-center">    

        {isTeacherPage || isCoursePage ? (
            <Link href="/">
            <Button variant="ghost">
                <LogOut className="h-4 w-4 mr-2"/>
                <p>Exit</p>
            </Button>
            </Link>
        ) : (
            <Link href="/teacher/courses">
                <Button size="sm" variant="ghost">
                    Teacher Mode
                </Button>
            </Link>
        )}   
            <UserButton 
            afterSignOutUrl="/"
            />

        </div>
        </>
    )
}