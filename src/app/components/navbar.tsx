"use client";

import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { NavigationMenu } from "@base-ui/react/navigation-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calendar", label: "Calendar" },
];

const Navbar = () => {
  return (
    <NavigationMenu.Root className="flex items-center w-full h-14 border-b border-white/20 px-6">
      <NavigationMenu.List className="flex items-center gap-6 list-none m-0 p-0">
        {navLinks.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link
              render={<Link href={link.href} />}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <div className="ml-auto flex items-center gap-4">
        <SignedOut>
          <SignInButton>
            <button className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors cursor-pointer">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="text-sm font-medium bg-foreground text-background px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity cursor-pointer">
              Sign up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </NavigationMenu.Root>
  );
};

export default Navbar;
