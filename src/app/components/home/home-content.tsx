"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Trophy,
  PenTool,
  Users,
  ArrowRight,
  Brain,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonIcon } from "@radix-ui/react-icons";
import { MdLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Session } from "@/lib/auth";
import ThemeToggle from "../theme-toggle";

const features = [
  {
    icon: <BookOpen className="h-8 w-8 mb-3" />,
    title: "Take a Quiz",
    description: "Challenge yourself with our diverse range of quizzes.",
    link: "/dashboard",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: <PenTool className="h-8 w-8 mb-3" />,
    title: "Create a Quiz",
    description: "Design your own quiz and share it with others.",
    link: "/dashboard",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: <Trophy className="h-8 w-8 mb-3" />,
    title: "Leaderboard",
    description: "See how you rank against other quiz takers.",
    link: "/dashboard",
    color: "from-amber-500 to-orange-400",
  },
  {
    icon: <Users className="h-8 w-8 mb-3" />,
    title: "Community",
    description: "Join our community of quiz enthusiasts.",
    link: "/dashboard",
    color: "from-emerald-500 to-teal-400",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

type Props = {
  session: Session | null;
};

export default function HomeContent({ session }: Props) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [top, setTop] = useState<boolean>(true);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    setTop(window.scrollY <= 10);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 flex h-16 items-center gap-4 px-4 md:px-6 z-50 transition-all duration-200",
          !top && "border-b shadow-sm bg-white"
        )}>
        <Link className="flex items-center gap-1" href="/">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Image src="/logo.svg" width={20} height={20} alt="" />
          </div>
          <div className="flex-1 text-left text-base leading-tight">
            <span className="truncate font-semibold">Quizify</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4 ml-auto">
          <ThemeToggle />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 border border-gray-600 cursor-pointer">
                  <AvatarImage src={""} alt="profile-image" />
                  <AvatarFallback className="bg-white">
                    <PersonIcon className="h-5 w-5 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center">
                  <IoSettingsOutline className="mr-2 w-5 h-5" /> Settings
                </DropdownMenuItem>
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
                  className="flex items-center hover:bg-red-100">
                  <MdLogout className="mr-2 w-5 h-5" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => router.push("/sign-in")}
              className="flex items-center gap-2">
              <PersonIcon className="h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16">
            <div className="relative inline-block">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-light opacity-75 blur-xl"
              />
              <h1 className="relative text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light">
                Quizify
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
              Challenge your mind, create quizzes, and compete in our
              interactive learning platform.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary-light hover:opacity-90 transition-all duration-300 rounded-full shadow-lg"
                onClick={() => router.push("/dashboard")}>
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}>
                <Card className="h-full bg-white/5 backdrop-blur-xl border-transparent hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${feature.color} p-4 shadow-lg`}
                      animate={{
                        rotate: hoveredIndex === index ? [0, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.4 }}>
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-2xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center text-lg">
                      {feature.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-6">
                    <Button
                      asChild
                      variant="ghost"
                      className="group hover:bg-white/10"
                      size="lg">
                      <Link href={feature.link} className="flex items-center">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to challenge your mind?
            </h2>
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 transition-colors duration-300">
              <Link href="/quizzes" className="flex items-center">
                <Brain className="mr-2 h-6 w-6" />
                Start Quizzing Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
