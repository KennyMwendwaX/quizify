"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeLogo from "../theme-logo";
import ThemeToggle from "../theme-toggle";
import { BookOpen, Menu } from "lucide-react";
import { PersonIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Session } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";

type Props = {
  session: Session | null;
};

export default function Navbar({ session }: Props) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // detect whether user has scrolled the page
  const scrollHandler = () => {
    setScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);
  return (
    <header
      className={cn(
        "fixed top-0 w-full flex h-16 items-center gap-4 px-4 md:px-6 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-sm border-b shadow-sm dark:border-slate-700 dark:shadow-slate-900/10"
          : "bg-transparent"
      )}>
      <Link className="flex items-center gap-2" href="/">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <ThemeLogo width={20} height={20} alt="Quizify logo" />
        </div>
        <div className="flex-1 text-left text-lg leading-tight">
          <span className="font-bold tracking-tight">Quizify</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center space-x-1 mx-auto">
        {["How It Works", "Features", "Popular Categories", "FAQ"].map(
          (item) => {
            const href = `#${item.toLowerCase().replace(/\s+/g, "-")}`;
            return (
              <Link key={item} href={href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium">
                  {item}
                </Button>
              </Link>
            );
          }
        )}
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <ThemeToggle />

        {/* Mobile Menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <ThemeLogo width={18} height={18} alt="Quizify logo" />
                </div>
                <span>Quizify</span>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-2">
              {["Features", "How It Works", "Testimonials", "FAQ"].map(
                (item) => (
                  <SheetClose asChild key={item}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-base">
                      {item}
                    </Button>
                  </SheetClose>
                )
              )}
              <div className="h-px bg-border my-4" />
              {session ? (
                <>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-base"
                      onClick={() => router.push("/dashboard")}>
                      <BookOpen className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-base"
                      onClick={() => router.push("/settings")}>
                      <IoSettingsOutline className="mr-2 h-4 w-4" /> Settings
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start text-base text-red-500"
                      onClick={() => {
                        signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              router.replace("/sign-in");
                            },
                          },
                        });
                      }}>
                      <MdLogout className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </SheetClose>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button
                      className="w-full"
                      onClick={() => router.push("/sign-in")}>
                      Sign In
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push("/sign-up")}>
                      Sign Up
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 border border-gray-300 dark:border-gray-600 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50">
                <AvatarImage src={""} alt="profile-image" />
                <AvatarFallback className="bg-muted">
                  <PersonIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="flex items-center">
                <BookOpen className="mr-2 w-4 h-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="flex items-center">
                <IoSettingsOutline className="mr-2 w-4 h-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.replace("/sign-in");
                      },
                    },
                  });
                }}
                className="flex items-center text-red-500 dark:text-red-400">
                <MdLogout className="mr-2 w-4 h-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/sign-up")}
              className="hidden md:flex">
              Sign Up
            </Button>
            <Button
              onClick={() => router.push("/sign-in")}
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-all">
              <PersonIcon className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
