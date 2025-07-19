"use client";

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Camera,
  Siren,
  Plane,
  BotMessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/zones", label: "Zone Monitoring", icon: Camera },
  { href: "/drones", label: "Drone Management", icon: Plane },
  { href: "/incidents", label: "Incident Reporting", icon: Siren },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <BotMessageSquare className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Eventide Intel</h1>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  icon={<link.icon />}
                  tooltip={link.label}
                >
                  {link.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
