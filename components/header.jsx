"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = (open) => {
    setIsMenuOpen(open);

    const content = document.getElementById("main-content");
    if (content) {
      if (open) {
        content.classList.add("blur-sm", "pointer-events-none");
      } else {
        content.classList.remove("blur-sm", "pointer-events-none");
      }
    }
  };

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Image
          src={"/Career.jpg"}
          alt="Job Portal Logo"
          width={200}
          height={60}
          className="h-12 py-1 w-auto object-contain"
        />

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Industry Insights
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>

            <DropdownMenu onOpenChange={handleMenuToggle}>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Career Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={14}
                className="min-w-[9rem] bg-background rounded-md shadow-md px-0 py-0"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href="/resume"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground w-full hover:bg-muted transition-colors cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Build Resume
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/ai-cover-letter"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground w-full hover:bg-muted transition-colors cursor-pointer"
                  >
                    <PenBox className="h-4 w-4 text-muted-foreground" />
                    Cover Letter
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/interview"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground w-full hover:bg-muted transition-colors cursor-pointer"
                  >
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    Interview Prep
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
