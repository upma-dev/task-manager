"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  NotebookText,
  Brain,
  MessageSquare,
  Settings,
  Bot,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatbotDialog } from "@/components/dashboard/ChatbotDialog";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/notes", label: "Notes", icon: NotebookText },
  { href: "/focus", label: "Focus Mode", icon: Brain },
];

export function AppLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen >
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
             <Bot className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-foreground group-data-[collapsible=icon]:hidden">
              StudyZen
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="text-primary-foreground_on_primary_hover focus:bg-sidebar-accent focus:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    tooltip={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-2 flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
           {/* Placeholder for potential settings or user profile */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-background/80 backdrop-blur-sm border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden text-primary hover:text-primary-foreground hover:bg-primary/90" />
            <h2 className="text-xl font-headline font-semibold">
              {navItems.find(item => item.href === pathname)?.label || "StudyZen"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <ChatbotDialog />
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
