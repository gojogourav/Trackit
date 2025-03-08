'use client'

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import Image from "next/image";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const path = usePathname()
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },

    {
      title: "Session",
      icon: (
        <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/session",
    },
    {
      title: "leaderboard",
      icon: (
        <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/leaderboard",
    },
    {
      title: "Ai Tips",
      icon: (
        <Image
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "/ai",
    },
    {
      title: "Find Friends",
      icon: (
        <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/user/getall",
    },
    {
      title: "Profile",
      icon: (
        <User className="text-neutral-500"/>
      ),
      href: "/user",
    },
    {
      title: "Update Profile",
      icon: (
        <User className="text-neutral-500"/>
      ),
      href: "/user/update",
    },
  ];
  return (
    <div className="bottom-0 fixed">
      <FloatingDock
        mobileClassName=" translate-y-20"
        items={links}
      />
    </div>
  );
}

