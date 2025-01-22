"use client";
import {
  Home,
  Inbox,
  OptionIcon,
  Settings,
  User,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAdminUser } from "@/hooks/use-user";
import Link from "next/link";
import { MdCategory, MdWorkspaces } from "react-icons/md";
// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: MdWorkspaces,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
const adminItems = [
  {
    title: "Staff",
    url: "/admin/staff",
    icon: User2Icon,
  },
  {
    title: "Payments",
    url: "/admin/payment",
    icon: User2Icon,
  },
  {
    title: "options",
    url: "/admin/option",
    icon: OptionIcon,
  },
  {
    title: "services",
    url: "/admin/services",
    icon: Inbox,
  },
  {
    title: "Category",
    url: "/admin/category",
    icon: MdCategory,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
];

export function AppSidebar() {
  const { data: user, isLoading } = useAdminUser();
  const adminRole = user?.user?.role;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {adminRole === "superadmin" &&
                adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
