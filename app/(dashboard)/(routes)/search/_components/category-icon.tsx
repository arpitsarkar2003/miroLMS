"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";

interface CategoryIconProps {
    label: string;
    value?: string;
    icon?: IconType;
}

export const CategoryIcon = ({
    label,
    value,
    icon: Icon,
}: CategoryIconProps) => {

    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams?.get("categoryId");
    const currentTitle = searchParams?.get("title");

    const isSelected = currentCategoryId === value;

    const onclick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: isSelected ? null : value,
                title: currentTitle
            }
        }, {skipNull: true, skipEmptyString: true});

        router.push(url);
    }

    return (
        <button
        onClick={onclick}
        className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-orange-700 transition", 
        isSelected && "border-orange-700 bg-orange-200/20 text-orange-800"
        )} type="button">
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}