import "./Sidebar.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Heart,
  BarChart3,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Today",
      path: "/today",
      icon: CalendarDays,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: ClipboardList,
    },
    {
      name: "Habits",
      path: "/habits",
      icon: Heart,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Journal",
      path: "/journal",
      icon: BookOpen,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  useEffect(() => {
    const getCurrentUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };

    getCurrentUser();
  }, []);

  const displayName =
  typeof user?.user_metadata?.name === "string" &&
  user.user_metadata.name.trim()
    ? user.user_metadata.name
    : user?.email ?? "";

  const avatarLetter = displayName
  ? displayName.charAt(0).toUpperCase()
  : "?";

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* Logo */}
      <div className="sidebar-logo">
        <span className="logo-text">myPlanner</span>
        <span className="logo-star">✧</span>
      </div>

      {/* Collapse Button */}
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          size={18}
          className={collapsed ? "rotate" : ""}
        />
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
              title={collapsed ? item.name : ""}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="sidebar-profile">

        <div className="profile-avatar">
          {avatarLetter}
        </div>

        <div className="profile-info">
          <strong>{displayName}</strong>
          <span>{user?.email}</span>
        </div>

        <ChevronDown
          className="profile-chevron"
          size={16}
        />

      </div>

    </aside>
  );
}

export default Sidebar;