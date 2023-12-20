"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import logo from "../logo.png";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="flex justify-between px-4 mx-6 mt-4">
      <Link href="/">
        <Image src={logo} alt="logo" width={50} height={50} />
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
            <NavigationMenuContent className="flex flex-col px-4 py-4 gap-2">
              <Link href="/">
                <NavigationMenuLink>Home</NavigationMenuLink>
              </Link>
              <Link href="/upload-map">
                <NavigationMenuLink>Create Map</NavigationMenuLink>
              </Link>
              <NavigationMenuLink>Book Desk</NavigationMenuLink>
              <NavigationMenuLink>Booknings</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};

export default Navbar;
