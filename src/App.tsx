import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Navbar, NavbarLabel, NavbarSection } from "./components/catalyst/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarFooter,
  SidebarSpacer,
} from "./components/catalyst/sidebar";
import { SidebarLayout } from "./components/catalyst/sidebar-layout";
import {
  BriefcaseIcon,
  DocumentTextIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { Switch } from "./components/catalyst/switch";

const navigation = [
  { label: "Dashboard", href: "/", icon: HomeIcon },
  { label: "Apply", href: "/apply", icon: BriefcaseIcon },
  { label: "Resume", href: "/resume", icon: DocumentTextIcon },
];

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";

    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
  });

  const location = useLocation();
  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    root.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarBody>
            <SidebarSection>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isCurrent = location.pathname === item.href;

                return (
                  <SidebarItem
                    key={item.href}
                    href={item.href}
                    current={isCurrent}
                  >
                    <span data-slot="icon">
                      <Icon />
                    </span>
                    <SidebarLabel>{item.label}</SidebarLabel>
                  </SidebarItem>
                );
              })}
            </SidebarSection>
            <SidebarSpacer />
            <SidebarSection>
              <div className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm text-zinc-600 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <SunIcon className="h-4 w-4 text-zinc-500 dark:hidden" />
                  <MoonIcon className="hidden h-4 w-4 text-zinc-500 dark:block" />
                  <span>Dark Theme</span>
                </div>
                <Switch
                  checked={isDark}
                  onChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Switch theme between dark/light"
                />
              </div>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter>
            <Navbar>
              <NavbarSection>
                <NavbarLabel>Job Application Dashboard</NavbarLabel>
              </NavbarSection>
            </Navbar>
          </SidebarFooter>
        </Sidebar>
      }
      navbar={null}
    >
      <Outlet />
    </SidebarLayout>
  );
}

export default App;
