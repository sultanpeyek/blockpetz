"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";

export const Navbar: React.FC = () => {
  const isMounted = useIsMounted();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between">
      <NavigationMenu className="p-4">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              asChild
            >
              <Link href="/" className="!font-bold text-xl">
                BlockPetz
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              asChild
            >
              <Link href="/">GitHub</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="flex-auto">&nbsp;</NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="h-12 mb-6 sm:mb-0 sm:pr-6">
        {isMounted && <WalletMultiButton />}
      </div>
    </div>
  );
};
