import * as React from "react";
import Link from "next/link";
import { NavItem } from "@/types/nav";
import { cn } from "@/lib/utils";
import RandomAnime from "./anime/random";
import GenresList from "./anime/genres";

interface MobileNavProps {
  items?: NavItem[];
  closeSheet: () => void; 
}

export function MobileNav({ items, closeSheet }: MobileNavProps) {
  return (
    <div className="flex flex-row gap-6 md:gap-10">
      {items?.length ? (
        <ul className="m-0 list-none p-0">
          {items?.map(
            (item, index) =>
              item.href && (
                <li key={index} className="mb-2 mt-4">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center text-sm font-medium text-muted-foreground",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                    onClick={closeSheet} 
                  >
                    {item.title}
                  </Link>
                </li>
              )
          )}
          <div className="mt-3">
            <GenresList />
          </div>
          <div className="mt-3">
            <RandomAnime />
          </div>
        </ul>
      ) : null}
    </div>
  );
}
