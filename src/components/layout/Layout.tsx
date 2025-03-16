import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  List,
  FileText,
  BarChart,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  readonly children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-h-screen">
          <div className="p-4 border-b flex items-center">
            <SidebarTrigger />
            <h1 className="ml-4 text-xl font-semibold">Arikkaiyagam</h1>
          </div>
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="py-6 px-4">
          <h2 className="text-xl font-bold text-white">Arikkaiyagam</h2>
          <p className="text-white/80 text-sm">Report Hub</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isActive("/") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link to="/">
                    <List size={18} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isActive("/tests") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link to="/tests">
                    <FileText size={18} />
                    <span>Tests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isActive("/answers") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link to="/answers">
                    <GraduationCap size={18} />
                    <span>Student Answers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isActive("/reports") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link to="/reports">
                    <BarChart size={18} />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    isActive("/settings") &&
                      "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Link to="/settings">
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
