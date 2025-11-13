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
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "text-center" : "text-base font-semibold tracking-wide"}>
            {!collapsed && "导航菜单"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-secondary/80 transition-colors duration-200"
                      activeClassName="bg-primary/10 text-primary font-semibold border-l-4 border-primary"
                    >
                      <item.icon className={collapsed ? "mx-auto" : "mr-3 h-5 w-5"} />
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
