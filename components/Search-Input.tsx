"use client";

import qs from "query-string";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export const SearchInput = () => {

    const [value, setValue] = useState("");
    const debaouncedValue = useDebounce(value, 500);

    const searchParams = useSearchParams();

    const router = useRouter();
    const pathName = usePathname();

    const currentCategoryId = searchParams?.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathName,
            query: {
                categoryId: currentCategoryId,
                title: debaouncedValue
            }
        }, {skipNull: true, skipEmptyString: true});

        router.push(url);
    }, [debaouncedValue, currentCategoryId, pathName]);

    return (
        <div className="relative">
            <SearchIcon 
                className="h-4 w-4 absolute top-3 left-3 text-slate-600"
            />
            <Input 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pl-9 w-full md:w-[300px] rounded-full bg-slate-100 focus-visible:ring-slate-100"
                placeholder="Search for a course..."
            />
        </div>
    );
}