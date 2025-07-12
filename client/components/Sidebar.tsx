import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Database,
  FileText,
  Settings,
  Upload,
  CheckCircle,
  BarChart3,
  Target,
  Filter,
  PlayCircle,
  Download,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    href: "/",
    icon: BarChart3,
    description: "Dashboard & analytics",
  },
  {
    name: "Upload Mapping",
    href: "/upload-mapping",
    icon: Upload,
    description: "Field mapping configuration",
  },
  {
    name: "Source Config",
    href: "/source-config",
    icon: Database,
    description: "Source database or file",
  },
  {
    name: "Target Config",
    href: "/target-config",
    icon: Target,
    description: "Target database or file",
  },
  {
    name: "Select Tables",
    href: "/select-tables",
    icon: Filter,
    description: "Choose tables & fields",
  },
  {
    name: "Validations",
    href: "/validations",
    icon: CheckCircle,
    description: "Configure validation rules",
  },
  {
    name: "Run Validation",
    href: "/run-validation",
    icon: PlayCircle,
    description: "Execute validation process",
  },
  {
    name: "Results",
    href: "/results",
    icon: FileText,
    description: "View validation results",
  },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Database className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sidebar-foreground">
              DataSync
            </h1>
            <p className="text-xs text-sidebar-foreground/70">
              Migration Validator
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70",
                )}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-sidebar-foreground/60 hidden lg:block">
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          to="/settings"
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-sidebar-foreground/70" />
          <div className="flex-1">
            <div className="text-sm font-medium">Settings</div>
            <div className="text-xs text-sidebar-foreground/60 hidden lg:block">
              App configuration
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
