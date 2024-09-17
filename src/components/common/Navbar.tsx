"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Settings2, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@nextui-org/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import TButton from "@/components/theme/TButton";
import AddFriendDialog from "@/components/common/AddFriendDialog";
import NavbarConvo from "./NavbarChat";
import Notification from "../notification/page";
import { SignOutButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useQuery(api.users.get);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavItems = () => (
    <>
      <AddFriendDialog />
      <NavbarConvo />
      <Notification />
    </>
  );

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-semibold md:text-3xl transition-all hover:text-primary">
                devhive
              </h1>
            </Link>
          </motion.div>

          {/* Search & Nav Items (Desktop) */}
          <div className="hidden md:flex items-center gap-4 p-2">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-[400px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for people etc..."
                  className="w-full pl-10 rounded-lg focus-visible:ring-2 focus-visible:ring-primary dark:bg-background dark:border-darkMuted border border-muted"
                  aria-label="Search"
                />
              </div>

              <NavItems />
              <TButton />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar
                  className="h-[40px] w-[40px] rounded-full cursor-pointer"
                  src={user?.imageUrl}
                  alt={user?.username}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <Button color="primary" className="w-full">
                    <Link href="/dashboard" className="flex items-center">
                      <Settings2 className="mr-2 h-4 w-4" />
                      My Settings
                    </Link>
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SignOutButton>
                    <Button variant="ghost" color="danger" className="w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="-mr-2 flex md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="md"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  onClick={toggleMenu}
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <X className="block h-6 w-6" />
                  ) : (
                    <Menu className="block h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  <div className="relative w-full max-w-[400px] mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search for people etc..."
                      className="w-full pl-10 rounded-lg focus-visible:ring-2 focus-visible:ring-primary dark:bg-background dark:border-darkMuted border border-muted"
                      aria-label="Search"
                    />
                  </div>
                  <NavItems />
                  <div className="pt-4 pb-3 border-t border-gray-700">
                    <div className="flex items-center px-5">
                      <Avatar
                        className="h-10 w-10 rounded-full"
                        src={user?.imageUrl}
                        alt={user?.email}
                      />
                      <div className="ml-3">
                        <div className="text-base font-medium leading-none text-white">
                          {user?.name}
                        </div>
                        <div className="text-sm font-medium leading-none text-gray-400">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 px-2 space-y-1">
                      <Button className="w-full mt-2">
                        <Link href="/dashboard">My Settings</Link>
                      </Button>
                      <SignOutButton>
                        <Button color="danger" className="w-full mt-2">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </SignOutButton>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
