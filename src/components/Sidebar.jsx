import "./Sidebar.css";
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
} from "lucide-react";

function Sidebar() {
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

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        myPlanner <span>✧</span>
      </div>

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
          H
        </div>

        <div className="profile-info">
          <strong>Hely</strong>
          <span>hely@example.com</span>
        </div>

        <ChevronDown size={16} />

      </div>

    </aside>
  );
}

export default Sidebar;