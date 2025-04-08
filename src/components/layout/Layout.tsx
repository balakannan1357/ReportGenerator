import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  FileText,
  GraduationCap,
  LandPlot,
  LayoutDashboard,
  List,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/", label: "Dashboard", icon: List },
  { path: "/tests", label: "Tests", icon: FileText },
  { path: "/answers", label: "Student Answers", icon: LandPlot },
  { path: "/students", label: "Students", icon: GraduationCap },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }) {
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
  const isActive = (path) => location.pathname === path;

  return (
    <Sidebar>
      <SidebarContent>
        <div className="py-6 px-4 flex items-center justify-center">
          <LayoutDashboard size={80} />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ path, label, icon: Icon }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      isActive(path) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Link to={path}>
                      <Icon size={18} />
                      <span>{label}</span>
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
