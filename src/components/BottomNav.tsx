import { Map, QrCode, History, User } from "lucide-react";
import { cn } from "./ui/utils";

type NavTab = "map" | "scan" | "history" | "profile";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    {
      id: "map" as NavTab,
      label: "Map",
      icon: Map,
    },
    {
      id: "scan" as NavTab,
      label: "Scan",
      icon: QrCode,
      isCenter: true,
    },
    {
      id: "history" as NavTab,
      label: "History",
      icon: History,
    },
    {
      id: "profile" as NavTab,
      label: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="relative bg-white border-t border-slate-200 flex-shrink-0">
      <div className="flex items-end justify-around px-4 pb-safe pt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex flex-col items-center justify-center relative -mt-6"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all",
                    "bg-amber-600 hover:bg-amber-700 active:scale-95"
                  )}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-xs mt-1 text-amber-600">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[60px] transition-colors",
                isActive
                  ? "text-amber-600"
                  : "text-slate-500 hover:text-slate-700 active:text-amber-600"
              )}
            >
              <Icon
                className={cn("w-6 h-6", isActive ? "stroke-[2.5]" : "")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
