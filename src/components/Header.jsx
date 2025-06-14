import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MountainIcon } from "lucide-react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
  },
  {
    name: "Monitoring",
    href: "/monitoring",
  },
  {
    name: "Alerts",
    href: "/alerts",
  },
  {
    name: "Map",
    href: "/map",
  },
];

export function Header() {
  return (
    <header className="bg-background border-b sticky top-0 z-40 px-10">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MountainIcon className="h-6 w-6 text-primary" />
          <Link href="/" className="text-2xl font-bold tracking-tight">
            DisasterIQ
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.name}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                  )}>
                    {item.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
} 