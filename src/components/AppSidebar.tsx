import { Home, BookOpen, FileText, ClipboardCheck, TrendingUp, Bot } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "主页", url: "/dashboard", icon: Home },
  { title: "课程", url: "/courses", icon: BookOpen },
  { title: "学习资料", url: "/materials", icon: FileText },
  { title: "作业与评测", url: "/assignments", icon: ClipboardCheck },
  { title: "学习统计", url: "/statistics", icon: TrendingUp },
  { title: "AI 助教", url: "/ai-assistant", icon: Bot },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-72"}
      collapsible="icon"
      style={{
        background: 'var(--gradient-sidebar)',
        boxShadow: 'var(--shadow-sidebar)',
        borderRight: '1px solid hsl(var(--sidebar-border))'
      }}
    >
      <SidebarContent className="py-6">
        <SidebarGroup className="px-3">
          <SidebarGroupLabel className={collapsed ? "text-center mb-4" : "text-base font-semibold tracking-wide mb-6 px-3 text-sidebar-foreground/80"}>
            {!collapsed && "导航菜单"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12">
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-all duration-300 rounded-xl px-4"
                      activeClassName="bg-primary/15 text-primary font-semibold border-l-4 border-primary shadow-md"
                    >
                      <item.icon className={collapsed ? "mx-auto h-5 w-5" : "mr-4 h-5 w-5"} />
                      {!collapsed && <span className="text-base font-medium">{item.title}</span>}
                    </NavLink>
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
