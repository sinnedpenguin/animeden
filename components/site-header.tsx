"use client"

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "./mobile-nav";
import { SearchBar } from "@/app/search/search-bar";
import { useState } from "react";
import UserAvatar from "./user/avatar";
import Image from 'next/image';

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "./ui/sheet";

export function SiteHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-4">
        <Link href="/home">
          <nav className="flex items-center space-x-2">
            <Image width={6} height={6} src="/logo.svg" alt="AD" className="h-6 w-6" />
            <span className="font-bold sm:inline">{siteConfig.name}</span>
          </nav>
        </Link>
        <nav className="hidden items-center space-x-2 md:flex">
          <MainNav items={siteConfig.mainNav} />
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="flex w-full items-center space-x-2 sm:w-auto">
            <SearchBar />
          </div>
          <nav className="hidden items-center space-x-1 md:flex">
            <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <div className={buttonVariants({ size: "icon", variant: "ghost" })}>
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link href={siteConfig.links.discord} target="_blank" rel="noreferrer">
              <div className={buttonVariants({ size: "icon", variant: "ghost" })}>
                <Icons.discord className="h-5 w-5" />
                <span className="sr-only">Discord</span>
              </div>
            </Link>
            <ThemeToggle />
            <UserAvatar />
          </nav>
          <div className="flex items-center space-x-2 md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger>
                <Icons.menu />
              </SheetTrigger>
              <SheetContent className="w-[80vw] sm:w-[80vw]">
                <SheetHeader className="flex items-center justify-between">
                  <div>
                    <SheetTitle>{siteConfig.name}</SheetTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                      <div className={buttonVariants({ size: "icon", variant: "ghost" })}>
                        <Icons.gitHub className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </div>
                    </Link>
                    <Link href={siteConfig.links.discord} target="_blank" rel="noreferrer">
                      <div className={buttonVariants({ size: "icon", variant: "ghost" })}>
                        <Icons.discord className="h-5 w-5" />
                        <span className="sr-only">Discord</span>
                      </div>
                    </Link>
                    <ThemeToggle />
                    <UserAvatar />
                  </div>
                </SheetHeader>
                <MobileNav items={siteConfig.mainNav} closeSheet={closeSheet} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}